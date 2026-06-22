// @ts-check
import { readFileSync } from 'node:fs'

/**
 * Parse CODEOWNERS and extract /apps/<service>/ → team(s) mappings.
 * CODEOWNERS uses last-match-wins precedence.
 * Only matches entries 1 or 2 levels under /apps/.
 */
export function parseCodeowners(content) {
  const serviceMap = new Map()

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    // Match /apps/<name>/ or /apps/<group>/<name>/ followed by team references
    const match = trimmed.match(
      /^\/apps\/([a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)?)\/?[\s*]+(@.+)/,
    )
    if (!match) continue

    const appPath = match[1]
    const teamsPart = match[2]

    // Skip deeper paths (e.g. /apps/web/screens/PetitionView/)
    if (appPath.split('/').length > 2) continue

    // Extract @island-is/<team> references
    const teams = [...teamsPart.matchAll(/@island-is\/([a-zA-Z0-9_-]+)/g)].map(
      (m) => m[1],
    )
    if (teams.length === 0) continue

    // Use the leaf directory name as service name
    const parts = appPath.split('/')
    const serviceName = parts[parts.length - 1]

    // Last match wins (CODEOWNERS precedence)
    serviceMap.set(serviceName, teams)
  }

  return serviceMap
}

/**
 * Build a v2.2 service definition payload.
 * Primary team = last in the list (most specific CODEOWNERS match).
 * Additional teams added as contacts.
 */
export function buildServiceDefinition(serviceName, teams) {
  const primaryTeam = teams[teams.length - 1]
  const definition = {
    'schema-version': 'v2.2',
    'dd-service': serviceName,
    team: primaryTeam,
  }

  if (teams.length > 1) {
    definition.contacts = teams
      .filter((t) => t !== primaryTeam)
      .map((t) => ({ name: t, type: 'email', contact: `${t}@island.is` }))
  }

  return definition
}

/**
 * Upsert a service definition to Datadog.
 */
export async function upsertServiceDefinition(
  definition,
  { apiKey, appKey, site },
) {
  const url = `https://api.${site}/api/v2/services/definitions`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'DD-API-KEY': apiKey,
      'DD-APPLICATION-KEY': appKey,
    },
    body: JSON.stringify(definition),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(
      `Failed to upsert ${definition['dd-service']}: ${res.status} ${body}`,
    )
  }

  return res.json()
}

// Main — only runs when executed directly
const isMain =
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/.*\//, '/'))

if (isMain) {
  const DD_API_KEY = process.env.DD_API_KEY
  const DD_APP_KEY = process.env.DD_APP_KEY
  const DD_SITE = process.env.DD_SITE || 'datadoghq.eu'
  const CODEOWNERS_PATH = process.env.CODEOWNERS_PATH || '.github/CODEOWNERS'
  const DRY_RUN = process.env.DRY_RUN === 'true'

  if (!DD_API_KEY || !DD_APP_KEY) {
    console.error('DD_API_KEY and DD_APP_KEY are required')
    process.exit(1)
  }

  const content = readFileSync(CODEOWNERS_PATH, 'utf-8')
  const serviceMap = parseCodeowners(content)

  console.log(`Parsed ${serviceMap.size} service(s) from CODEOWNERS`)

  let success = 0
  let failed = 0

  for (const [service, teams] of serviceMap) {
    const definition = buildServiceDefinition(service, teams)

    if (DRY_RUN) {
      console.log(`[DRY RUN] ${service} → team: ${definition.team}`)
      success++
      continue
    }

    try {
      await upsertServiceDefinition(definition, {
        apiKey: DD_API_KEY,
        appKey: DD_APP_KEY,
        site: DD_SITE,
      })
      console.log(`${service} → team: ${definition.team}`)
      success++
    } catch (err) {
      console.error(err.message)
      failed++
    }
  }

  console.log(`Done: ${success} synced, ${failed} failed`)
  if (failed > 0) process.exit(1)
}

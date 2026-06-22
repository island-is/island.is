// @ts-check
import { readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const DEFAULT_TEAM = 'core'

/**
 * Parse CODEOWNERS into a list of rules (path pattern → teams).
 * Rules are ordered as in the file; last match wins.
 */
export function parseCodeownersRules(content) {
  const rules = []

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const match = trimmed.match(/^(\S+)\s+(.+)/)
    if (!match) continue

    const pattern = match[1]
    const teamsPart = match[2]

    const teams = [...teamsPart.matchAll(/@island-is\/([a-zA-Z0-9_-]+)/g)].map(
      (m) => m[1],
    )
    if (teams.length === 0) continue

    rules.push({ pattern, teams })
  }

  return rules
}

/**
 * Find the best matching team(s) for a given app path.
 * CODEOWNERS uses last-match-wins, so we iterate all rules
 * and return the last one that matches.
 */
export function resolveOwner(appPath, rules) {
  // Normalize: ensure leading slash, ensure trailing slash
  const normalized = '/' + appPath.replace(/^\//, '').replace(/\/$/, '') + '/'

  let bestMatch = null

  for (const rule of rules) {
    if (pathMatches(normalized, rule.pattern)) {
      bestMatch = rule.teams
    }
  }

  return bestMatch || [DEFAULT_TEAM]
}

/**
 * Simple CODEOWNERS pattern matching.
 * Supports: exact prefix, trailing *, and ** glob.
 */
function pathMatches(filePath, pattern) {
  // Normalize pattern
  let p = pattern.replace(/\/$/, '')
  if (!p.startsWith('/')) p = '/' + p

  // Handle glob patterns
  if (p.endsWith('*')) {
    const prefix = p.slice(0, -1)
    return filePath.startsWith(prefix)
  }

  // Exact directory match: /apps/web matches /apps/web/ and /apps/web/anything
  return filePath.startsWith(p + '/') || filePath === p
}

/**
 * Discover all deployable services (apps with docker targets).
 */
export function discoverDeployableApps(repoRoot) {
  const output = execSync(
    'find apps -name "project.json" -maxdepth 3 | xargs grep -l "docker-"',
    { cwd: repoRoot, encoding: 'utf-8' },
  )

  return output
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((p) => p.replace('/project.json', ''))
}

/**
 * Derive the service name from the app path.
 * Uses the Nx project name from project.json if available.
 */
export function getServiceName(appPath, repoRoot) {
  const projectJsonPath = `${repoRoot}/${appPath}/project.json`
  if (existsSync(projectJsonPath)) {
    const project = JSON.parse(readFileSync(projectJsonPath, 'utf-8'))
    if (project.name) return project.name
  }
  // Fallback: use the leaf directory
  const parts = appPath.split('/')
  return parts[parts.length - 1]
}

/**
 * Build a v2.2 service definition payload.
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
export async function upsertServiceDefinition(definition, { apiKey, appKey, site }) {
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

// Main
const isMain =
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/.*\//, '/'))

if (isMain) {
  const DD_API_KEY = process.env.DD_API_KEY
  const DD_APP_KEY = process.env.DD_APP_KEY
  const DD_SITE = process.env.DD_SITE || 'datadoghq.eu'
  const CODEOWNERS_PATH = process.env.CODEOWNERS_PATH || '.github/CODEOWNERS'
  const DRY_RUN = process.env.DRY_RUN === 'true'
  const REPO_ROOT = process.env.REPO_ROOT || '.'

  if (!DD_API_KEY || !DD_APP_KEY) {
    console.error('DD_API_KEY and DD_APP_KEY are required')
    process.exit(1)
  }

  const codeownersContent = readFileSync(CODEOWNERS_PATH, 'utf-8')
  const rules = parseCodeownersRules(codeownersContent)
  const apps = discoverDeployableApps(REPO_ROOT)

  console.log(`Found ${apps.length} deployable app(s), ${rules.length} CODEOWNERS rule(s)`)

  let success = 0
  let failed = 0

  for (const appPath of apps) {
    const serviceName = getServiceName(appPath, REPO_ROOT)
    const teams = resolveOwner(appPath, rules)
    const definition = buildServiceDefinition(serviceName, teams)

    if (DRY_RUN) {
      console.log(`[DRY RUN] ${serviceName} → team: ${definition.team}`)
      success++
      continue
    }

    try {
      await upsertServiceDefinition(definition, {
        apiKey: DD_API_KEY,
        appKey: DD_APP_KEY,
        site: DD_SITE,
      })
      console.log(`${serviceName} → team: ${definition.team}`)
      success++
    } catch (err) {
      console.error(err.message)
      failed++
    }
  }

  console.log(`Done: ${success} synced, ${failed} failed`)
  if (failed > 0) process.exit(1)
}

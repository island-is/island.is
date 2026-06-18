// @ts-check
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, appendFileSync } from 'node:fs'

const DATADOG_CI_VERSION = 'v5.19.0'
const DATADOG_CI_URL = `https://github.com/DataDog/datadog-ci/releases/download/${DATADOG_CI_VERSION}/datadog-ci_linux-x64`
const DATADOG_CI_PATH = './datadog-ci'

/**
 * Resolve the list of deployed services from either:
 * 1. Explicit DORA_SERVICES env var (comma-separated)
 * 2. A JSON data file (array of objects with .project field)
 */
export function getServices() {
  if (process.env.DORA_SERVICES) {
    return process.env.DORA_SERVICES.split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  const dataFile = process.env.DORA_DATA_FILE || '/tmp/data.json'
  if (existsSync(dataFile)) {
    const data = JSON.parse(readFileSync(dataFile, 'utf-8'))
    const projects = [...new Set(data.map((d) => d.project).filter(Boolean))]
    return projects.sort()
  }

  return []
}

/**
 * Handle mode=start: record current timestamp to GITHUB_OUTPUT
 */
export function handleStart() {
  const startedAt = Math.floor(Date.now() / 1000)
  const output = process.env.GITHUB_OUTPUT
  if (output) {
    appendFileSync(output, `started-at=${startedAt}\n`)
  }
  console.log(`DORA: recorded start time ${startedAt}`)
  return startedAt
}

/**
 * Handle mode=finish: install datadog-ci and send deployment events
 */
export function handleFinish() {
  const finishedAt = Math.floor(Date.now() / 1000)
  const startedAt = process.env.DORA_STARTED_AT
    ? parseInt(process.env.DORA_STARTED_AT)
    : finishedAt - 1

  const env = process.env.DORA_ENV
  const repoUrl = process.env.GIT_REPO_URL
  const commitSha = process.env.GIT_COMMIT_SHA

  if (!env) {
    console.error('DORA: environment is required for mode=finish')
    process.exit(1)
  }

  const services = getServices()
  if (services.length === 0) {
    console.log('DORA: no services to report, skipping')
    return { sent: 0, services: [] }
  }

  // Install datadog-ci
  if (!existsSync(DATADOG_CI_PATH)) {
    console.log(`DORA: installing datadog-ci ${DATADOG_CI_VERSION}`)
    execSync(
      `curl -L --fail "${DATADOG_CI_URL}" --output ${DATADOG_CI_PATH} && chmod +x ${DATADOG_CI_PATH}`,
      { stdio: 'inherit' },
    )
  }

  // Send events
  for (const service of services) {
    console.log(`DORA: ${service} -> ${env}`)
    execSync(
      `${DATADOG_CI_PATH} dora deployment` +
        ` --service "${service}"` +
        ` --started-at "${startedAt}"` +
        ` --finished-at "${finishedAt}"` +
        ` --git-repository-url "${repoUrl}"` +
        ` --git-commit-sha "${commitSha}"` +
        ` --env "${env}"`,
      { stdio: 'inherit' },
    )
  }

  console.log(`DORA: sent ${services.length} deployment event(s)`)
  return { sent: services.length, services }
}

// Main entry point — only runs when executed directly (not imported)
const isMain =
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/.*\//, '/'))

if (isMain) {
  const mode = process.env.DORA_MODE

  if (mode === 'start') {
    handleStart()
    process.exit(0)
  }

  if (mode === 'finish') {
    handleFinish()
    process.exit(0)
  }

  console.error(`DORA: unknown mode "${mode}", expected "start" or "finish"`)
  process.exit(1)
}

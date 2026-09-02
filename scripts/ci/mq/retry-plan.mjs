// @ts-check
// Classifies non-successful merge-queue jobs as infrastructure cancellations
// (runner/Spot shutdown) vs genuine failures, and emits targeted retry
// matrices. Identity comes from a per-job log marker (MQ_JOB_KEY=...), never
// from the (truncated) job name. Defaults to "genuine" on any ambiguity.

import core from '@actions/core'
import github from '@actions/github'

const SHUTDOWN_SIGNATURE = 'The runner has received a shutdown signal'
const KEY_RE = /MQ_JOB_KEY=([^\r\n']+)/

const STAGE = {
  tests: (name) => /^tests \(/.test(name),
  docker: (name) => /^docker-build \(/.test(name),
  typecheck: (name) => name === 'typecheck',
}

function parseJson(env, fallback) {
  const raw = process.env[env]
  if (!raw || raw.trim() === '') return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

async function fetchLog(octokit, owner, repo, jobId) {
  try {
    const resp = await octokit.rest.actions.downloadJobLogsForWorkflowRun({
      owner,
      repo,
      job_id: jobId,
    })
    if (typeof resp.data === 'string') return resp.data
    if (resp.url) return await (await fetch(resp.url)).text()
    if (resp.data) return Buffer.from(resp.data).toString('utf8')
  } catch {
    return null
  }
  return null
}

function classify(logText) {
  // Returns { infra: boolean, key: string|null }. No log => cannot classify.
  if (logText == null) return { infra: false, key: null }
  const infra = logText.includes(SHUTDOWN_SIGNATURE)
  const m = logText.match(KEY_RE)
  const key = m ? m[1].trim() : null
  return { infra, key }
}

async function main() {
  const token = process.env.GH_TOKEN
  if (!token) throw new Error('GH_TOKEN is required')
  const octokit = github.getOctokit(token)
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/')
  const runId = Number(process.env.GITHUB_RUN_ID)

  const origTests = parseJson('ORIG_TESTS', { projects: [] })
  const origTestKeys = new Set(origTests.projects || [])
  // DOCKER_CHUNKS is an array of stringified chunk objects.
  const origDocker = parseJson('ORIG_DOCKER', [])
  const dockerByProject = new Map()
  for (const entry of origDocker) {
    try {
      const obj = typeof entry === 'string' ? JSON.parse(entry) : entry
      dockerByProject.set(obj.projects, entry)
    } catch {
      /* ignore malformed entry */
    }
  }

  // Optional simulation for workflow_dispatch validation (no real kill needed).
  const simTests = (process.env.SIMULATE_TESTS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const simDocker = (process.env.SIMULATE_DOCKER || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const jobs = await octokit.paginate(
    octokit.rest.actions.listJobsForWorkflowRun,
    { owner, repo, run_id: runId, per_page: 100 },
  )

  const retryTests = new Set()
  const retryDocker = new Set()
  let retryTypecheck = false
  const genuine = []

  for (const job of jobs) {
    const name = job.name || ''
    const stage = STAGE.tests(name)
      ? 'tests'
      : STAGE.docker(name)
      ? 'docker'
      : STAGE.typecheck(name)
      ? 'typecheck'
      : null
    if (!stage) continue
    if (job.conclusion === 'success' || job.conclusion === 'skipped') continue
    if (job.status !== 'completed') {
      genuine.push(name) // still running/queued at plan time is unexpected
      continue
    }

    const log = await fetchLog(octokit, owner, repo, job.id)
    const { infra, key } = classify(log)

    if (!infra) {
      genuine.push(name)
      continue
    }
    // Infra cancellation: map back to the original matrix entry via MQ_JOB_KEY.
    if (stage === 'typecheck') {
      retryTypecheck = true
      continue
    }
    if (stage === 'tests') {
      if (key && origTestKeys.has(key)) retryTests.add(key)
      else genuine.push(name) // could not map reliably => fail-safe
      continue
    }
    if (stage === 'docker') {
      if (key && dockerByProject.has(key)) retryDocker.add(key)
      else genuine.push(name)
    }
  }

  // Apply simulation overrides (workflow_dispatch only).
  for (const k of simTests) if (origTestKeys.has(k)) retryTests.add(k)
  for (const k of simDocker) if (dockerByProject.has(k)) retryDocker.add(k)

  const testsOut = JSON.stringify({ projects: [...retryTests] })
  const dockerOut = JSON.stringify(
    [...retryDocker].map((p) => dockerByProject.get(p)),
  )

  core.setOutput('tests', testsOut)
  core.setOutput('docker', dockerOut)
  core.setOutput('has_tests', retryTests.size > 0 ? 'true' : 'false')
  core.setOutput('has_docker', retryDocker.size > 0 ? 'true' : 'false')
  core.setOutput('typecheck', retryTypecheck ? 'true' : 'false')
  core.setOutput('genuine', JSON.stringify(genuine))

  core.info(
    `retry-plan: tests=${retryTests.size} docker=${retryDocker.size} ` +
      `typecheck=${retryTypecheck} genuine=${genuine.length}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

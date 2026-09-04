// @ts-check
// Classifies non-successful merge-queue jobs as infrastructure cancellations
// (runner/Spot shutdown) vs genuine failures, and emits targeted retry
// matrices. Identity comes from a per-job log marker (MQ_JOB_KEY=...), never
// from the (truncated) job name. Defaults to "genuine" on any ambiguity.
//
// Dependency-free: uses only Node 20 built-ins (global fetch, fs) so it runs
// with just actions/setup-node, no yarn install / load-deps required.

import fs from 'node:fs'

const SHUTDOWN_SIGNATURE = 'The runner has received a shutdown signal'
const KEY_RE_G = /MQ_JOB_KEY=([^\r\n']+)/g

const STAGE = {
  tests: (name) => /^tests \(/.test(name),
  docker: (name) => /^docker-build \(/.test(name),
  typecheck: (name) => name === 'typecheck',
}

function setOutput(name, value) {
  const line = `${name}=${value}\n`
  if (process.env.GITHUB_OUTPUT)
    fs.appendFileSync(process.env.GITHUB_OUTPUT, line)
  else process.stdout.write(line)
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

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'islandis-retry-plan',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function listJobs(token, owner, repo, runId) {
  const jobs = []
  for (let page = 1; ; page++) {
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/jobs?per_page=100&page=${page}`
    const res = await fetch(url, { headers: ghHeaders(token) })
    if (!res.ok) throw new Error(`list jobs failed: ${res.status}`)
    const data = await res.json()
    jobs.push(...(data.jobs || []))
    if (!data.jobs || data.jobs.length < 100 || jobs.length >= data.total_count)
      break
  }
  return jobs
}

async function fetchLogOnce(token, owner, repo, jobId) {
  // 302 redirects to a signed storage URL; fetch follows it and strips the
  // Authorization header on the cross-origin hop (per spec).
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`
    const res = await fetch(url, { headers: ghHeaders(token) })
    if (res.ok) {
      const text = await res.text()
      if (text && text.length > 0) return text
    }
  } catch {
    /* transient network error */
  }
  return null
}

function extractKey(log, knownKeys) {
  // The run-script header logs the literal "MQ_JOB_KEY=${AFFECTED_PROJECTS}";
  // only the executed output has the real value. Pick the match that validates
  // against the known chunk set (the literal never validates).
  const keys = [...log.matchAll(KEY_RE_G)].map((m) => m[1].trim())
  if (!knownKeys) return null
  return keys.find((k) => knownKeys.has(k)) ?? null
}

// Poll the job log until the shutdown signature appears (infra) or we time out
// (treated as genuine). Handles both the post-completion log-availability race
// and partially-flushed logs.
async function inspectJob(
  token,
  owner,
  repo,
  jobId,
  knownKeys,
  attempts = 8,
  delayMs = 3000,
) {
  for (let i = 0; i < attempts; i++) {
    const log = await fetchLogOnce(token, owner, repo, jobId)
    if (log && log.includes(SHUTDOWN_SIGNATURE)) {
      return { infra: true, key: extractKey(log, knownKeys) }
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs))
  }
  return { infra: false, key: null }
}

async function main() {
  const token = process.env.GH_TOKEN
  if (!token) throw new Error('GH_TOKEN is required')
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/')
  const runId = process.env.GITHUB_RUN_ID

  const origTests = parseJson('ORIG_TESTS', { projects: [] })
  const origTestKeys = new Set(origTests.projects || [])
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

  const simTests = (process.env.SIMULATE_TESTS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const simDocker = (process.env.SIMULATE_DOCKER || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const jobs = await listJobs(token, owner, repo, runId)

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
      genuine.push(name)
      continue
    }

    const knownKeys =
      stage === 'tests'
        ? origTestKeys
        : stage === 'docker'
        ? new Set(dockerByProject.keys())
        : null
    const { infra, key } = await inspectJob(
      token,
      owner,
      repo,
      job.id,
      knownKeys,
    )

    if (!infra) {
      genuine.push(name)
      continue
    }
    if (stage === 'typecheck') {
      retryTypecheck = true
      continue
    }
    if (stage === 'tests') {
      if (key) retryTests.add(key)
      else genuine.push(name)
      continue
    }
    if (stage === 'docker') {
      if (key) retryDocker.add(key)
      else genuine.push(name)
    }
  }

  for (const k of simTests) if (origTestKeys.has(k)) retryTests.add(k)
  for (const k of simDocker) if (dockerByProject.has(k)) retryDocker.add(k)

  setOutput('tests', JSON.stringify({ projects: [...retryTests] }))
  setOutput(
    'docker',
    JSON.stringify([...retryDocker].map((p) => dockerByProject.get(p))),
  )
  setOutput('has_tests', retryTests.size > 0 ? 'true' : 'false')
  setOutput('has_docker', retryDocker.size > 0 ? 'true' : 'false')
  setOutput('typecheck', retryTypecheck ? 'true' : 'false')
  setOutput('genuine', JSON.stringify(genuine))

  console.log(
    `retry-plan: tests=${retryTests.size} docker=${retryDocker.size} ` +
      `typecheck=${retryTypecheck} genuine=${genuine.length}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

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
const KEY_RE = /MQ_JOB_KEY=([^\r\n']+)/

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

async function fetchLog(token, owner, repo, jobId, attempts = 6) {
  // 302 redirects to a signed storage URL; fetch follows it and strips the
  // Authorization header on the cross-origin hop (per spec). Job logs can 404
  // briefly right after completion, so retry before giving up.
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: ghHeaders(token) })
      if (res.ok) {
        const text = await res.text()
        if (text && text.length > 0) return text
      }
    } catch {
      /* transient network error; retry */
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 3000))
  }
  return null
}

function classify(logText) {
  if (logText == null) return { infra: false, key: null }
  const infra = logText.includes(SHUTDOWN_SIGNATURE)
  const m = logText.match(KEY_RE)
  return { infra, key: m ? m[1].trim() : null }
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

    const log = await fetchLog(token, owner, repo, job.id)
    const { infra, key } = classify(log)

    if (!infra) {
      genuine.push(name)
      continue
    }
    if (stage === 'typecheck') {
      retryTypecheck = true
      continue
    }
    if (stage === 'tests') {
      if (key && origTestKeys.has(key)) retryTests.add(key)
      else genuine.push(name)
      continue
    }
    if (stage === 'docker') {
      if (key && dockerByProject.has(key)) retryDocker.add(key)
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

// @ts-check
// Merges cloudposse matrix-outputs read results from the original docker-build
// namespace and the docker-build-retry namespace. Keys (uuidv5 of the project)
// are disjoint across namespaces: a chunk is either an original success or a
// retry success, never both. Retry values take precedence on any collision.
//
// Dependency-free: Node built-ins only.

import fs from 'node:fs'

const FIELDS = ['value', 'project', 'target', 'imageName', 'imageTag']

function setOutput(name, value) {
  const line = `${name}=${value}\n`
  if (process.env.GITHUB_OUTPUT)
    fs.appendFileSync(process.env.GITHUB_OUTPUT, line)
  else process.stdout.write(line)
}

function parse(name) {
  const raw = process.env[name]
  if (!raw || raw.trim() === '') return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

const orig = parse('ORIG')
const retry = parse('RETRY')

const merged = {}
for (const field of FIELDS) {
  merged[field] = { ...(orig[field] || {}), ...(retry[field] || {}) }
}

setOutput('result', JSON.stringify(merged))
console.log(
  `merge-docker-outputs: original=${Object.keys(orig.value || {}).length} ` +
    `retry=${Object.keys(retry.value || {}).length} ` +
    `merged=${Object.keys(merged.value).length}`,
)

// @ts-check
// Merges cloudposse matrix-outputs read results from the original docker-build
// namespace and the docker-build-retry namespace. Keys (uuidv5 of the project)
// are disjoint across namespaces: a chunk is either an original success or a
// retry success, never both. Retry values take precedence on any collision.

import core from '@actions/core'

const FIELDS = ['value', 'project', 'target', 'imageName', 'imageTag']

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

core.setOutput('result', JSON.stringify(merged))
core.info(
  `merge-docker-outputs: original=${Object.keys(orig.value || {}).length} ` +
    `retry=${Object.keys(retry.value || {}).length} ` +
    `merged=${Object.keys(merged.value).length}`,
)

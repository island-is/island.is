#!/usr/bin/env node

const { readFileSync, unlinkSync } = require('fs')
const { join, resolve } = require('path')

const MANIFEST_FILE = '.csp-hashes.json'
const MANIFEST_VERSION = 1
const allowedDirectives = ['script-src', 'style-src-elem']
const sha256Hash = /^'sha256-[A-Za-z0-9+/]{43}='$/u

const validateManifest = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('CSP hash manifest must be an object')
  }
  if (value.version !== MANIFEST_VERSION) {
    throw new Error(`Unsupported CSP hash manifest version: ${value.version}`)
  }
  if (
    !value.hashes ||
    typeof value.hashes !== 'object' ||
    Array.isArray(value.hashes)
  ) {
    throw new Error('CSP hash manifest hashes must be an object')
  }

  const manifestKeys = Object.keys(value).sort()
  if (manifestKeys.join(',') !== 'hashes,version') {
    throw new Error(
      `Unknown CSP hash manifest field: ${manifestKeys.join(', ')}`,
    )
  }
  const directiveKeys = Object.keys(value.hashes).sort()
  if (directiveKeys.join(',') !== allowedDirectives.slice().sort().join(',')) {
    throw new Error(
      `CSP hash manifest must contain exactly: ${allowedDirectives.join(', ')}`,
    )
  }

  for (const directive of allowedDirectives) {
    const hashes = value.hashes[directive]
    if (!Array.isArray(hashes)) {
      throw new Error(`CSP hash manifest ${directive} must be an array`)
    }
    for (const hash of hashes) {
      if (typeof hash !== 'string' || !sha256Hash.test(hash)) {
        throw new Error(`Invalid ${directive} hash: ${String(hash)}`)
      }
    }
    if (new Set(hashes).size !== hashes.length) {
      throw new Error(`CSP hash manifest ${directive} contains duplicates`)
    }
    if (hashes.join('\n') !== hashes.slice().sort().join('\n')) {
      throw new Error(`CSP hash manifest ${directive} must be sorted`)
    }
  }

  return value
}

const manifestPath = (documentRoot) =>
  join(resolve(documentRoot), MANIFEST_FILE)

const readManifest = (documentRoot) => {
  const contents = readFileSync(manifestPath(documentRoot), 'utf8')

  let parsed
  try {
    parsed = JSON.parse(contents)
  } catch (error) {
    throw new Error(`Invalid CSP hash manifest JSON: ${error.message}`)
  }
  return validateManifest(parsed)
}

const removeManifest = (documentRoot) => unlinkSync(manifestPath(documentRoot))

const parseSelectedDirectives = (value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error('CONTENT_SECURITY_POLICY_HASH_DIRECTIVES must not be empty')
  }
  const directives = value.trim().split(/\s+/u)
  if (new Set(directives).size !== directives.length) {
    throw new Error('CSP hash directives must not contain duplicates')
  }
  for (const directive of directives) {
    if (!allowedDirectives.includes(directive)) {
      throw new Error(`Unsupported CSP hash directive: ${directive}`)
    }
  }
  return directives
}

const parsePolicy = (
  policy,
  environmentVariable = 'CONTENT_SECURITY_POLICY',
) => {
  if (typeof policy !== 'string' || policy.trim() === '') {
    throw new Error(`${environmentVariable} must not be empty`)
  }
  if (/[\r\n\0]/u.test(policy)) {
    throw new Error(
      `${environmentVariable} contains invalid control characters`,
    )
  }

  const directives = policy.split(';').map((part) => part.trim())
  if (directives.some((part) => part === '')) {
    throw new Error(`${environmentVariable} contains an empty directive`)
  }

  const parsed = directives.map((serialized) => {
    const [name, ...sources] = serialized.split(/\s+/u)
    if (!/^[a-z][a-z0-9-]*$/u.test(name)) {
      throw new Error(`Invalid CSP directive: ${name}`)
    }
    return { name, sources }
  })
  const names = parsed.map(({ name }) => name)
  if (new Set(names).size !== names.length) {
    throw new Error(`${environmentVariable} contains duplicate directives`)
  }
  return parsed
}

const mergeHashes = (
  policy,
  manifest,
  selectedDirectiveValue,
  environmentVariable = 'CONTENT_SECURITY_POLICY',
) => {
  const selected = parseSelectedDirectives(selectedDirectiveValue)
  const directives = parsePolicy(policy, environmentVariable)

  for (const name of selected) {
    const directive = directives.find((candidate) => candidate.name === name)
    if (!directive) {
      throw new Error(
        `Selected CSP hash directive is missing from ${environmentVariable}: ${name}`,
      )
    }
    const hashes = manifest.hashes[name]
    for (const hash of hashes) {
      if (!directive.sources.includes(hash)) directive.sources.push(hash)
    }
  }

  return directives
    .map(({ name, sources }) => [name, ...sources].join(' '))
    .join('; ')
}

const shellQuote = (value) => `'${value.replace(/'/gu, `'"'"'`)}'`

const configuredPolicy = (value) => value !== undefined && value !== ''

const preparePolicies = ({ enforce, reportOnly, selected }, manifest) => {
  const selectedDirectives =
    selected === undefined || selected === ''
      ? undefined
      : parseSelectedDirectives(selected).join(' ')
  const policies = [
    ['CONTENT_SECURITY_POLICY', enforce],
    ['CONTENT_SECURITY_POLICY_REPORT_ONLY', reportOnly],
  ]
  const configuredPolicies = policies.filter(([, policy]) =>
    configuredPolicy(policy),
  )

  if (selectedDirectives && configuredPolicies.length === 0) {
    throw new Error(
      'CONTENT_SECURITY_POLICY_HASH_DIRECTIVES requires an enforcement or report-only policy',
    )
  }

  const prepared = Object.fromEntries(
    policies.map(([environmentVariable, policy]) => {
      if (!configuredPolicy(policy)) return [environmentVariable, '']
      // Validate every configured policy even when no hashes were selected.
      parsePolicy(policy, environmentVariable)
      return [
        environmentVariable,
        selectedDirectives
          ? mergeHashes(
              policy,
              manifest,
              selectedDirectives,
              environmentVariable,
            )
          : policy,
      ]
    }),
  )

  return {
    enforce: prepared.CONTENT_SECURITY_POLICY,
    reportOnly: prepared.CONTENT_SECURITY_POLICY_REPORT_ONLY,
  }
}

const serializePolicyExports = ({ enforce, reportOnly }) =>
  `CONTENT_SECURITY_POLICY=${shellQuote(enforce)}\n` +
  `CONTENT_SECURITY_POLICY_REPORT_ONLY=${shellQuote(reportOnly)}\n`

if (require.main === module) {
  try {
    const documentRoot = process.argv[2] ?? '/usr/share/nginx/html'
    const manifest = readManifest(documentRoot)
    const policies = preparePolicies(
      {
        enforce: process.env.CONTENT_SECURITY_POLICY,
        reportOnly: process.env.CONTENT_SECURITY_POLICY_REPORT_ONLY,
        selected: process.env.CONTENT_SECURITY_POLICY_HASH_DIRECTIVES,
      },
      manifest,
    )
    const exports = serializePolicyExports(policies)
    removeManifest(documentRoot)
    process.stdout.write(exports)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}

module.exports = {
  MANIFEST_FILE,
  MANIFEST_VERSION,
  mergeHashes,
  parsePolicy,
  parseSelectedDirectives,
  preparePolicies,
  readManifest,
  removeManifest,
  serializePolicyExports,
  shellQuote,
  validateManifest,
}

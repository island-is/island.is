#!/usr/bin/env node
// Fetches a service's OpenAPI definition from the X-Road getOpenAPI
// metaservice, and compares two OpenAPI definitions.
//
// Usage:
//   node openapi.mjs fetch <servicePath> <out.json>
//   node openapi.mjs compare <a> <b> [--labels <a>,<b>] [--out <report.md>]
//
// fetch exit codes: 0 ok, 2 nothing answered (network), 3 HTTP / X-Road
// error, 4 the response isn't an OpenAPI definition.
// Output files go in a collection's folder; ../.gitignore is written if it
// doesn't exist yet. See SKILL.md for when each command is used.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

// Must match xroad_base and xroad_client in generate.mjs's shared environment.
const XROAD_BASE = 'http://localhost:8081'
const XROAD_CLIENT = 'IS-DEV/GOV/10000/island-is-client'
const SHARED_INSTANCE = 'IS-DEV'
const FETCH_TIMEOUT_MS = 20000

const [command, ...args] = process.argv.slice(2)

const fail = (code, lines) => {
  console.error(lines.filter((l) => l !== undefined).join('\n'))
  process.exit(code)
}

// The output root (the folder above each collection's folder) is inside the
// repo. A .gitignore that ignores everything, itself included, keeps it out of
// git on every machine. Same as in generate.mjs.
const writeOutput = (file, text) => {
  const dir = path.dirname(path.resolve(file))
  fs.mkdirSync(dir, { recursive: true })
  const ignoreFile = path.join(dir, '..', '.gitignore')
  if (!fs.existsSync(ignoreFile)) fs.writeFileSync(ignoreFile, '*\n')
  fs.writeFileSync(file, text)
}

// js-yaml is resolved from the current repo (island.is has it installed).
const loadYaml = (text) =>
  createRequire(path.join(process.cwd(), 'package.json'))('js-yaml').load(text)

const parseSpec = (text, file = '') => {
  if (/\.ya?ml$/i.test(file)) return loadYaml(text)
  try {
    return JSON.parse(text)
  } catch {
    return loadYaml(text)
  }
}

const isOpenApi = (doc) =>
  Boolean(
    doc && typeof doc === 'object' && (doc.openapi || doc.swagger) && doc.paths,
  )

const countOperations = (doc) =>
  Object.values(doc.paths || {}).reduce(
    (n, item) =>
      n +
      Object.keys(item || {}).filter((k) =>
        ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(
          k,
        ),
      ).length,
    0,
  )

// --- fetch ---------------------------------------------------------------

const fetchSpec = async ([servicePath, outFile]) => {
  if (!servicePath || !outFile)
    fail(1, ['Usage: node openapi.mjs fetch <servicePath> <out.json>'])
  const parts = servicePath.replace(/^\/+|\/+$/g, '').split('/')
  if (parts.length !== 5)
    fail(1, [
      `Expected INSTANCE/CLASS/MEMBERCODE/SUBSYSTEM/SERVICECODE, got "${servicePath}".`,
    ])
  if (parts[0] !== SHARED_INSTANCE)
    fail(1, [`Only ${SHARED_INSTANCE} is supported, got "${parts[0]}".`])
  const serviceCode = parts.pop()
  const url = `${XROAD_BASE}/r1/${parts.join(
    '/',
  )}/getOpenAPI?serviceCode=${encodeURIComponent(serviceCode)}`
  const curl = `curl -sS -H 'X-Road-Client: ${XROAD_CLIENT}' -H 'Accept: application/json' '${url}' -o '${path.resolve(
    outFile,
  )}'`
  const curlHint = `To fetch it yourself:\n  ${curl}`

  let response
  try {
    response = await fetch(url, {
      headers: { 'X-Road-Client': XROAD_CLIENT, Accept: 'application/json' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
  } catch (error) {
    const code = error.cause?.code || error.name
    fail(2, [
      `NETWORK ${code}: no response from ${XROAD_BASE} (${
        error.cause?.message || error.message
      }).`,
      `URL: ${url}`,
      curlHint,
    ])
  }

  const text = await response.text()
  if (!response.ok) {
    // X-Road errors are JSON: { type, message, detail }.
    let xroad
    try {
      xroad = JSON.parse(text)
    } catch {
      // Not JSON; shown raw below.
    }
    fail(3, [
      `HTTP ${response.status} ${response.statusText}`,
      xroad?.type
        ? `X-Road error: ${xroad.type}: ${xroad.message ?? ''}`
        : `Body: ${text.slice(0, 500)}`,
      `URL: ${url}`,
      curlHint,
    ])
  }

  let doc
  try {
    doc = parseSpec(text)
  } catch {
    // Not JSON or YAML; reported below.
  }
  if (!isOpenApi(doc)) {
    fail(4, [
      `NOT_OPENAPI: HTTP ${response.status} (${
        response.headers.get('content-type') || 'no content type'
      }, ${
        text.length
      } bytes), but the body isn't an OpenAPI or Swagger definition.`,
      `Body starts with: ${text.slice(0, 300) || '(empty)'}`,
      `URL: ${url}`,
    ])
  }

  writeOutput(outFile, JSON.stringify(doc, null, 2) + '\n')
  console.log(
    `OK ${outFile}: ${doc.info?.title ?? '(no title)'} ${
      doc.info?.version ?? ''
    }, ` +
      `${doc.openapi ? `OpenAPI ${doc.openapi}` : `Swagger ${doc.swagger}`}, ` +
      `${Object.keys(doc.paths).length} paths, ${countOperations(
        doc,
      )} operations.`,
  )
}

// --- compare -------------------------------------------------------------

const DOC_KEYS = new Set([
  'description',
  'summary',
  'title',
  'example',
  'examples',
  'externalDocs',
])

// Groups a difference so the report can lead with what changes requests and
// responses, and end with documentation and metadata.
const categorise = (trail) => {
  const [root, , method, section] = trail
  if (trail.some((key) => DOC_KEYS.has(key))) return 'Documentation'
  if (root === 'paths') {
    if (trail.length <= 3) return 'Operations'
    if (['parameters', 'requestBody'].includes(section)) return 'Request'
    if (section === 'responses') return 'Response'
    if (['operationId', 'tags'].includes(section)) return 'Naming'
    return method === 'parameters' ? 'Request' : 'Other'
  }
  if (root === 'components' || root === 'definitions') return 'Schemas'
  if (root === 'securityDefinitions' || root === 'security') return 'Security'
  return 'Metadata'
}
const CATEGORY_ORDER = [
  'Operations',
  'Request',
  'Response',
  'Schemas',
  'Security',
  'Naming',
  'Other',
  'Documentation',
  'Metadata',
]

const isPrimitiveArray = (value) =>
  Array.isArray(value) &&
  value.every((v) => v === null || typeof v !== 'object')

const diff = (a, b, trail = [], out = []) => {
  if (JSON.stringify(a) === JSON.stringify(b)) return out
  if (isPrimitiveArray(a) && isPrimitiveArray(b)) {
    const sameSet = a.length === b.length && a.every((v) => b.includes(v))
    out.push({ trail, a, b, kind: sameSet ? 'order' : 'changed' })
    return out
  }
  const bothObjects =
    a &&
    b &&
    typeof a === 'object' &&
    typeof b === 'object' &&
    Array.isArray(a) === Array.isArray(b)
  if (!bothObjects) {
    out.push({
      trail,
      a,
      b,
      kind: a === undefined ? 'onlyB' : b === undefined ? 'onlyA' : 'changed',
    })
    return out
  }
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)]))
    diff(a[key], b[key], [...trail, key], out)
  return out
}

const MAX_CELL = 160
const cell = (value) => {
  if (value === undefined) return '_(missing)_'
  const text = JSON.stringify(value)
  return (
    text.length > MAX_CELL ? `${text.slice(0, MAX_CELL)}…` : text
  ).replace(/\|/g, '\\|')
}

const compareSpecs = (argv) => {
  const flag = (name) => {
    const i = argv.indexOf(name)
    return i === -1 ? undefined : argv.splice(i, 2)[1]
  }
  const labels = (flag('--labels') || 'A,B').split(',')
  const outFile = flag('--out')
  const [fileA, fileB] = argv
  if (!fileA || !fileB)
    fail(1, [
      'Usage: node openapi.mjs compare <a> <b> [--labels <a>,<b>] [--out <report.md>]',
    ])
  const [a, b] = [fileA, fileB].map((f) =>
    parseSpec(fs.readFileSync(f, 'utf8'), f),
  )

  const kindLabel = {
    onlyA: `only in ${labels[0]}`,
    onlyB: `only in ${labels[1]}`,
    changed: 'changed',
    order: 'order only',
  }
  const differences = diff(a, b).map((d) => ({
    ...d,
    kind: kindLabel[d.kind],
    category: categorise(d.trail),
  }))
  const byCategory = Object.groupBy(differences, (d) => d.category)
  const summary = CATEGORY_ORDER.filter((c) => byCategory[c]).map(
    (c) => `${c}: ${byCategory[c].length}`,
  )

  const report = [
    `# OpenAPI comparison`,
    '',
    `- ${labels[0]}: \`${fileA}\` (${a.info?.title ?? '?'} ${
      a.info?.version ?? ''
    }, ${countOperations(a)} operations)`,
    `- ${labels[1]}: \`${fileB}\` (${b.info?.title ?? '?'} ${
      b.info?.version ?? ''
    }, ${countOperations(b)} operations)`,
    '',
    differences.length
      ? `${differences.length} differences. ${summary.join(', ')}.`
      : 'No differences.',
    ...CATEGORY_ORDER.filter((c) => byCategory[c]).flatMap((c) => [
      '',
      `## ${c} (${byCategory[c].length})`,
      '',
      `| Where | Change | ${labels[0]} | ${labels[1]} |`,
      '|---|---|---|---|',
      ...byCategory[c].map(
        (d) =>
          `| \`${d.trail.join(' › ')}\` | ${d.kind} | ${cell(d.a)} | ${cell(
            d.b,
          )} |`,
      ),
    ]),
  ].join('\n')

  if (outFile) {
    writeOutput(outFile, report + '\n')
    console.log(
      `${differences.length} differences${
        summary.length ? ` (${summary.join(', ')})` : ''
      }. Report: ${outFile}`,
    )
  } else {
    console.log(report)
  }
  process.exit(differences.length ? 1 : 0)
}

if (command === 'fetch') await fetchSpec(args)
else if (command === 'compare') compareSpecs(args)
else fail(1, ['Usage: node openapi.mjs fetch|compare …'])

#!/usr/bin/env node

const { createHash } = require('crypto')
const { readFileSync, readdirSync, writeFileSync } = require('fs')
const { join, relative, resolve } = require('path')
const { JSDOM, VirtualConsole } = require('jsdom')

const MANIFEST_FILE = '.csp-hashes.json'
const MANIFEST_VERSION = 1

// https://mimesniff.spec.whatwg.org/#javascript-mime-type
const classicScriptMimeTypes = new Set([
  'application/ecmascript',
  'application/javascript',
  'application/x-ecmascript',
  'application/x-javascript',
  'text/ecmascript',
  'text/javascript',
  'text/javascript1.0',
  'text/javascript1.1',
  'text/javascript1.2',
  'text/javascript1.3',
  'text/javascript1.4',
  'text/javascript1.5',
  'text/jscript',
  'text/livescript',
  'text/x-ecmascript',
  'text/x-javascript',
])

const hashText = (text) =>
  `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`

const listHtmlFiles = (directory) => {
  const files = []

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...listHtmlFiles(path))
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      files.push(path)
    }
  }

  return files.sort()
}

const scriptKind = (element) => {
  const rawType = element.getAttribute('type')?.trim().toLowerCase() ?? ''
  if (rawType === '') return 'classic'
  if (['module', 'importmap', 'speculationrules'].includes(rawType)) {
    return rawType
  }

  const mimeType = rawType.split(';', 1)[0].trim()
  if (classicScriptMimeTypes.has(mimeType)) return 'classic'
  return undefined
}

const hashesFromHtml = (html, file = '<html>') => {
  // Parsing style elements can make jsdom attempt CSSOM parsing. CSP hashing
  // only needs the HTML parser's textContent, so suppress unrelated CSS errors.
  const virtualConsole = new VirtualConsole()
  const document = new JSDOM(html, { virtualConsole }).window.document
  const scriptHashes = []
  const styleHashes = []

  for (const script of document.querySelectorAll('script')) {
    if (script.hasAttribute('src')) continue

    const text = script.textContent ?? ''
    const kind = scriptKind(script)
    if (kind) {
      scriptHashes.push(hashText(text))
      continue
    }

    const type = script.getAttribute('type')?.trim() || '<empty>'
    if (
      type.toLowerCase() === 'application/json' &&
      script.id === '__SI_ENVIRONMENT__'
    ) {
      continue
    }
    if (text.trim() === '') continue

    throw new Error(`Unknown inline script type "${type}" in ${file}`)
  }

  for (const style of document.querySelectorAll('style')) {
    styleHashes.push(hashText(style.textContent ?? ''))
  }

  return { scriptHashes, styleHashes }
}

const generateManifest = (documentRoot) => {
  const root = resolve(documentRoot)
  const scriptHashes = new Set()
  const styleHashes = new Set()

  for (const file of listHtmlFiles(root)) {
    const html = readFileSync(file, 'utf8')
    const hashes = hashesFromHtml(html, relative(root, file))
    hashes.scriptHashes.forEach((hash) => scriptHashes.add(hash))
    hashes.styleHashes.forEach((hash) => styleHashes.add(hash))
  }

  return {
    version: MANIFEST_VERSION,
    hashes: {
      'script-src': [...scriptHashes].sort(),
      'style-src-elem': [...styleHashes].sort(),
    },
  }
}

const writeManifest = (documentRoot) => {
  const manifest = generateManifest(documentRoot)
  writeFileSync(
    join(resolve(documentRoot), MANIFEST_FILE),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  )
  return manifest
}

if (require.main === module) {
  try {
    const documentRoot = process.argv[2]
    if (!documentRoot) throw new Error('Usage: generate-csp-hashes.js <dist>')
    const manifest = writeManifest(documentRoot)
    console.log(
      `Generated ${MANIFEST_FILE} with ${manifest.hashes['script-src'].length} script and ${manifest.hashes['style-src-elem'].length} style hashes`,
    )
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}

module.exports = {
  MANIFEST_FILE,
  MANIFEST_VERSION,
  generateManifest,
  hashText,
  hashesFromHtml,
  listHtmlFiles,
  writeManifest,
}

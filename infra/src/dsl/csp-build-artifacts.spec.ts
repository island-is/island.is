import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'

type HashManifest = {
  version: number
  hashes: Record<'script-src' | 'style-src-elem', string[]>
}

const repositoryRoot = resolve(__dirname, '../../..')
const generator = require(resolve(
  repositoryRoot,
  'scripts/dockerfile-assets/csp/generate-csp-hashes.js',
)) as {
  generateManifest: (root: string) => HashManifest
  hashesFromHtml: (
    html: string,
    file?: string,
  ) => { scriptHashes: string[]; styleHashes: string[] }
}
const merger = require(resolve(
  repositoryRoot,
  'scripts/dockerfile-assets/csp/merge-csp-hashes.js',
)) as {
  mergeHashes: (
    policy: string,
    manifest: HashManifest,
    selected: string,
  ) => string
  readAndRemoveManifest: (root: string) => HashManifest
  validateManifest: (value: unknown) => HashManifest
}

const scriptHash = "'sha256-WpNQcWxgTJamkluTtRGYllok20MyGquJpWh9YXWGA4E='"
const styleHash = "'sha256-l2fpHp1LAzTlmh04npgBvGosXEpVAKPCx5FWh5ZbLBY='"
const validManifest = (): HashManifest => ({
  version: 1,
  hashes: {
    'script-src': [scriptHash],
    'style-src-elem': [styleHash],
  },
})

describe('CSP build artifact hashing', () => {
  it('hashes parser textContent exactly, including Unicode and normalized line endings', () => {
    const result = generator.hashesFromHtml(
      '<script>  console.log("Halló 👋")\r\n</script>' +
        '<style>body { color: red; }\r\n</style>',
    )

    expect(result).toEqual({
      scriptHashes: ["'sha256-dlV39+tZdtEjcjnXIcERDEWBWAN9KiNWGpy/VOwMm8U='"],
      styleHashes: [styleHash],
    })
  })

  it('hashes classic scripts, modules, import maps, and speculation rules', () => {
    const result = generator.hashesFromHtml(`
      <script>window.a=1</script>
      <script type="module">import "./app.js"</script>
      <script type="importmap">{"imports":{}}</script>
      <script type="speculationrules">{"prefetch":[]}</script>
    `)

    expect(result.scriptHashes).toEqual([
      scriptHash,
      "'sha256-+tsC8fTY9TkcahZorwQsurk33C9lfnARehyr2vGAzz4='",
      "'sha256-URrTy+Il/Nz0lHojVUx275hWqAWhkSF0VsHbUM4/6Hw='",
      "'sha256-iCmLT321orx9XB2HAc2rMGzJNxtBxBtg4uKp/p7UHH4='",
    ])
  })

  it('ignores external scripts, runtime JSON, and empty inert data blocks', () => {
    const result = generator.hashesFromHtml(`
      <script src="app.js" type="unknown">not executed inline</script>
      <script id="__SI_ENVIRONMENT__" type="application/json">{"x":1}</script>
      <script type="application/ld+json">   </script>
    `)

    expect(result.scriptHashes).toEqual([])
  })

  it('fails for a non-empty unknown inline script type', () => {
    expect(() =>
      generator.hashesFromHtml(
        '<script type="application/ld+json">{"x":1}</script>',
        'nested/index.html',
      ),
    ).toThrow(/Unknown inline script type.*nested\/index.html/)
  })

  it('recurses through HTML files and writes deduplicated sorted values', () => {
    const root = mkdtempSync(join(tmpdir(), 'csp-generation-'))
    mkdirSync(join(root, 'nested'))
    writeFileSync(
      join(root, 'index.html'),
      '<script>window.a=1</script><style>body { color: red; }\n</style>',
    )
    writeFileSync(
      join(root, 'nested', 'iframe.html'),
      '<script>window.a=1</script><script>import "./app.js"</script>',
    )

    expect(generator.generateManifest(root)).toEqual({
      version: 1,
      hashes: {
        'script-src': [
          "'sha256-+tsC8fTY9TkcahZorwQsurk33C9lfnARehyr2vGAzz4='",
          scriptHash,
        ],
        'style-src-elem': [styleHash],
      },
    })
  })
})

describe('CSP hash manifest startup merging', () => {
  it('validates and merges selected directives into an enforcement policy', () => {
    expect(
      merger.mergeHashes(
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; style-src-elem 'self'",
        merger.validateManifest(validManifest()),
        'script-src style-src-elem',
      ),
    ).toBe(
      `default-src 'self'; script-src 'self' ${scriptHash}; style-src 'self' 'unsafe-inline'; style-src-elem 'self' ${styleHash}`,
    )
  })

  it('can select scripts without merging Storybook style hashes', () => {
    expect(
      merger.mergeHashes(
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'",
        merger.validateManifest(validManifest()),
        'script-src',
      ),
    ).toBe(
      `default-src 'self'; script-src 'self' ${scriptHash}; style-src 'self' 'unsafe-inline'`,
    )
  })

  it('fails for malformed manifests, hashes, and selected directives', () => {
    expect(() => merger.validateManifest({ version: 2, hashes: {} })).toThrow(
      /Unsupported.*version/,
    )
    expect(() =>
      merger.validateManifest({
        ...validManifest(),
        hashes: { ...validManifest().hashes, 'script-src': ["'sha256-nope'"] },
      }),
    ).toThrow(/Invalid script-src hash/)
    expect(() =>
      merger.mergeHashes(
        "default-src 'self'; script-src 'self'",
        validManifest(),
        'style-src-elem',
      ),
    ).toThrow(/missing from policy/)
    expect(() =>
      merger.mergeHashes(
        "default-src 'self'; script-src 'self'",
        validManifest(),
        'script-src unknown-src',
      ),
    ).toThrow(/Unsupported CSP hash directive/)
  })

  it('removes the manifest from the document root after reading it', () => {
    const root = mkdtempSync(join(tmpdir(), 'csp-runtime-'))
    const path = join(root, '.csp-hashes.json')
    writeFileSync(path, JSON.stringify(validManifest()))

    expect(merger.readAndRemoveManifest(root)).toEqual(validManifest())
    expect(existsSync(path)).toBe(false)
  })
})

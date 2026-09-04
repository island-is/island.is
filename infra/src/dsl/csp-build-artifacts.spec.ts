import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'
import { spawnSync } from 'child_process'

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
const mergerPath = resolve(
  repositoryRoot,
  'scripts/dockerfile-assets/csp/merge-csp-hashes.js',
)
const merger = require(mergerPath) as {
  mergeHashes: (
    policy: string,
    manifest: HashManifest,
    selected: string,
  ) => string
  preparePolicies: (
    policies: {
      enforce?: string
      reportOnly?: string
      selected?: string
    },
    manifest: HashManifest,
  ) => { enforce: string; reportOnly: string }
  readManifest: (root: string) => HashManifest
  removeManifest: (root: string) => void
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

  it('merges selected hashes into enforcement, report-only, or both policies', () => {
    expect(
      merger.preparePolicies(
        {
          enforce: "default-src 'self'; script-src 'self'",
          selected: 'script-src',
        },
        validManifest(),
      ),
    ).toEqual({
      enforce: `default-src 'self'; script-src 'self' ${scriptHash}`,
      reportOnly: '',
    })
    expect(
      merger.preparePolicies(
        {
          reportOnly: "default-src 'self'; script-src 'self'",
          selected: 'script-src',
        },
        validManifest(),
      ),
    ).toEqual({
      enforce: '',
      reportOnly: `default-src 'self'; script-src 'self' ${scriptHash}`,
    })
    expect(
      merger.preparePolicies(
        {
          enforce: "script-src 'self'",
          reportOnly: 'script-src https://example.is',
          selected: 'script-src',
        },
        validManifest(),
      ),
    ).toEqual({
      enforce: `script-src 'self' ${scriptHash}`,
      reportOnly: `script-src https://example.is ${scriptHash}`,
    })
  })

  it('supports policy-less startup and policies without hash selection', () => {
    expect(merger.preparePolicies({}, validManifest())).toEqual({
      enforce: '',
      reportOnly: '',
    })
    expect(
      merger.preparePolicies(
        { reportOnly: "default-src 'self'" },
        validManifest(),
      ),
    ).toEqual({ enforce: '', reportOnly: "default-src 'self'" })
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
    ).toThrow(/missing from CONTENT_SECURITY_POLICY/)
    expect(() =>
      merger.mergeHashes(
        "default-src 'self'; script-src 'self'",
        validManifest(),
        'script-src unknown-src',
      ),
    ).toThrow(/Unsupported CSP hash directive/)
    expect(() =>
      merger.preparePolicies({ selected: 'script-src' }, validManifest()),
    ).toThrow(/requires an enforcement or report-only policy/)
    expect(() =>
      merger.preparePolicies(
        { reportOnly: "default-src 'self';" },
        validManifest(),
      ),
    ).toThrow(/CONTENT_SECURITY_POLICY_REPORT_ONLY contains an empty directive/)
  })

  it('reads the manifest without removing it and removes it explicitly', () => {
    const root = mkdtempSync(join(tmpdir(), 'csp-runtime-'))
    const path = join(root, '.csp-hashes.json')
    writeFileSync(path, JSON.stringify(validManifest()))

    expect(merger.readManifest(root)).toEqual(validManifest())
    expect(existsSync(path)).toBe(true)
    merger.removeManifest(root)
    expect(existsSync(path)).toBe(false)
  })

  it('retains the manifest on startup failure and removes it after success', () => {
    const failedRoot = mkdtempSync(join(tmpdir(), 'csp-runtime-failed-'))
    const failedPath = join(failedRoot, '.csp-hashes.json')
    writeFileSync(failedPath, JSON.stringify(validManifest()))

    const failed = spawnSync(process.execPath, [mergerPath, failedRoot], {
      encoding: 'utf8',
      env: {
        ...process.env,
        CONTENT_SECURITY_POLICY: "default-src 'self'",
        CONTENT_SECURITY_POLICY_HASH_DIRECTIVES: 'script-src',
        CONTENT_SECURITY_POLICY_REPORT_ONLY: '',
      },
    })
    expect(failed.status).toBe(1)
    expect(failed.stderr).toMatch(/missing from CONTENT_SECURITY_POLICY/)
    expect(existsSync(failedPath)).toBe(true)

    const successfulRoot = mkdtempSync(join(tmpdir(), 'csp-runtime-ok-'))
    const successfulPath = join(successfulRoot, '.csp-hashes.json')
    writeFileSync(successfulPath, JSON.stringify(validManifest()))
    const successful = spawnSync(
      process.execPath,
      [mergerPath, successfulRoot],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          CONTENT_SECURITY_POLICY: "script-src 'self'",
          CONTENT_SECURITY_POLICY_HASH_DIRECTIVES: 'script-src',
          CONTENT_SECURITY_POLICY_REPORT_ONLY: '',
        },
      },
    )
    expect(successful.status).toBe(0)
    expect(successful.stdout).toContain('CONTENT_SECURITY_POLICY=')
    expect(successful.stdout).toContain('CONTENT_SECURITY_POLICY_REPORT_ONLY=')
    expect(existsSync(successfulPath)).toBe(false)
  })

  it('retains malformed manifests for inspection', () => {
    const root = mkdtempSync(join(tmpdir(), 'csp-runtime-invalid-'))
    const path = join(root, '.csp-hashes.json')
    writeFileSync(path, '{not json')

    const result = spawnSync(process.execPath, [mergerPath, root], {
      encoding: 'utf8',
      env: {
        ...process.env,
        CONTENT_SECURITY_POLICY: '',
        CONTENT_SECURITY_POLICY_HASH_DIRECTIVES: '',
        CONTENT_SECURITY_POLICY_REPORT_ONLY: '',
      },
    })
    expect(result.status).toBe(1)
    expect(result.stderr).toMatch(/Invalid CSP hash manifest JSON/)
    expect(existsSync(path)).toBe(true)
  })
})

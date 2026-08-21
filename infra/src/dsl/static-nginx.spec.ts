import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('shared static nginx image', () => {
  const repositoryRoot = resolve(__dirname, '../../..')
  const template = readFileSync(
    resolve(
      repositoryRoot,
      'scripts/dockerfile-assets/nginx/default.conf.template',
    ),
    'utf8',
  )
  const dockerfile = readFileSync(
    resolve(repositoryRoot, 'scripts/ci/Dockerfile'),
    'utf8',
  )

  const entrypoint = readFileSync(
    resolve(
      repositoryRoot,
      'scripts/dockerfile-assets/bash/05-content-security-policy.sh',
    ),
    'utf8',
  )

  it('defines empty defaults for both policies and hash selection', () => {
    expect(dockerfile).toMatch(/CONTENT_SECURITY_POLICY= \\\n/)
    expect(dockerfile).toMatch(/CONTENT_SECURITY_POLICY_HASH_DIRECTIVES=/)
    expect(dockerfile).toContain('CONTENT_SECURITY_POLICY_REPORT_ONLY=')
  })

  it('adds enforcement and report-only CSP to the SPA location', () => {
    expect(template.match(/add_header Content-Security-Policy /g)).toHaveLength(
      1,
    )
    expect(
      template.match(/add_header Content-Security-Policy-Report-Only /g),
    ).toHaveLength(1)
    expect(template).toContain('"$CONTENT_SECURITY_POLICY_REPORT_ONLY"')

    const hashedAssetLocation = template.slice(
      template.indexOf('location ~'),
      template.indexOf('error_page'),
    )
    expect(hashedAssetLocation).not.toContain('Content-Security-Policy')
  })

  it('generates manifests in a static-only stage and installs an early hook', () => {
    expect(dockerfile).toContain('FROM builder AS static-builder')
    expect(dockerfile).toContain('generate-csp-hashes.js')
    expect(dockerfile).toContain('COPY --from=static-builder')
    expect(dockerfile).toContain('05-content-security-policy.sh')
    expect(entrypoint).toContain('merge-csp-hashes.js')
    expect(entrypoint).toContain(
      'envsubst "\\${CONTENT_SECURITY_POLICY} \\${CONTENT_SECURITY_POLICY_REPORT_ONLY}"',
    )
    expect(entrypoint).toContain(
      'export CONTENT_SECURITY_POLICY CONTENT_SECURITY_POLICY_REPORT_ONLY',
    )
    expect(entrypoint).not.toContain("envsubst '${CONTENT_SECURITY_POLICY}'")
    expect(entrypoint).toContain('default.conf.template')
    expect(
      '05-content-security-policy.sh' < '20-envsubst-on-templates.sh',
    ).toBe(true)
  })
})

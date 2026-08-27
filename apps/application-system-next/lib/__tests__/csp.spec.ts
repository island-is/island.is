import { buildCsp, generateNonce } from '../csp'

describe('csp', () => {
  describe('generateNonce', () => {
    it('returns a non-empty, unique value per call', () => {
      const a = generateNonce()
      const b = generateNonce()

      expect(a).toEqual(expect.any(String))
      expect(a.length).toBeGreaterThan(0)
      expect(a).not.toBe(b)
    })
  })

  describe('buildCsp', () => {
    const nonce = 'test-nonce'
    const directives = buildCsp(nonce, { dev: false })
      .split(';')
      .map((d) => d.trim())

    const directive = (name: string) =>
      directives.find((d) => d === name || d.startsWith(`${name} `))

    it('puts the nonce and strict-dynamic in script-src', () => {
      const scriptSrc = directive('script-src')
      expect(scriptSrc).toContain(`'nonce-${nonce}'`)
      expect(scriptSrc).toContain(`'strict-dynamic'`)
    })

    it(`adds 'unsafe-eval' only in development (webpack dev bundles use eval)`, () => {
      const devScriptSrc = buildCsp(nonce, { dev: true })
        .split(';')
        .map((d) => d.trim())
        .find((d) => d.startsWith('script-src '))
      const prodScriptSrc = buildCsp(nonce, { dev: false })
        .split(';')
        .map((d) => d.trim())
        .find((d) => d.startsWith('script-src '))

      expect(devScriptSrc).toContain(`'unsafe-eval'`)
      expect(prodScriptSrc).not.toContain(`'unsafe-eval'`)
    })

    it('allows inline style attributes (island-ui/vanilla-extract) via style-src', () => {
      // Nonces/hashes never cover inline style="" attributes, so this is required.
      expect(directive('style-src')).toContain(`'unsafe-inline'`)
    })

    it('locks down the dangerous directives', () => {
      expect(directive('default-src')).toBe(`default-src 'self'`)
      expect(directive('object-src')).toBe(`object-src 'none'`)
      expect(directive('base-uri')).toBe(`base-uri 'self'`)
      expect(directive('frame-ancestors')).toBe(`frame-ancestors 'none'`)
    })

    it('does not put a nonce in style-src (would be a no-op for style attributes)', () => {
      expect(directive('style-src')).not.toContain('nonce-')
    })
  })
})

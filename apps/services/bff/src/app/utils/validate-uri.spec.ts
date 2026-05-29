import { validateUri } from './validate-uri'

describe('validateUri', () => {
  const allowedUris = [
    'https://beta.dev01.devland.is/stjornbord',
    'https://api.stjornbord.island.is',
  ]

  it('should return false if uri is not a string', () => {
    expect(validateUri(123 as any, allowedUris)).toBe(false)
  })

  it('should return false if allowedUris is not an array', () => {
    expect(
      validateUri('https://beta.dev01.devland.is/stjornbord', {} as any),
    ).toBe(false)
  })

  it('should return false if allowedUri is not a string', () => {
    const invalidAllowedUris = [123 as any, 'https://api.stjornbord.island.is']
    expect(
      validateUri(
        'https://beta.dev01.devland.is/stjornbord',
        invalidAllowedUris,
      ),
    ).toBe(false)
  })

  it('should return true for URI with the same hostname in different caseing', () => {
    expect(
      validateUri('https://Beta.Dev01.Devland.Is/stjornbord', allowedUris),
    ).toBe(true)
  })

  it('should return true for valid allowed URI', () => {
    expect(
      validateUri('https://beta.dev01.devland.is/stjornbord', allowedUris),
    ).toBe(true)
  })

  it('should return false for subdomain attacks', () => {
    expect(
      validateUri(
        // A subdomain that could pass if validation isn't strict
        'https://beta.dev01.devland.is.evil.is/stjornbord',
        allowedUris,
      ),
    ).toBe(false)
  })

  it('should return false for protocol mismatch', () => {
    expect(
      validateUri('http://beta.dev01.devland.is/stjornbord', allowedUris),
    ).toBe(false)
  })

  it('should return false for path traversal', () => {
    expect(
      validateUri(
        // Path traversal should fail
        'https://beta.dev01.devland.is/stjornbord/../admin',
        allowedUris,
      ),
    ).toBe(false)
  })

  it('should return false for invalid hostname', () => {
    expect(
      validateUri('https://malicious-site.com/stjornbord', allowedUris),
    ).toBe(false)
  })

  it('should return true for another valid allowed URI', () => {
    expect(validateUri('https://api.stjornbord.island.is', allowedUris)).toBe(
      true,
    )
  })

  it('should return false for partially matching but different path', () => {
    expect(
      validateUri('https://beta.dev01.devland.is/different-path', allowedUris),
    ).toBe(false)
  })

  it('should return true for feature deployment hostnames when beta host is allowed', () => {
    const betaAllowedUris = ['https://beta.dev01.devland.is/minarsidur']
    expect(
      validateUri(
        'https://featcreate-pdf-viewer-beta.dev01.devland.is/minarsidur/menntun/grunnskoli/nemendur',
        betaAllowedUris,
      ),
    ).toBe(true)
  })

  it('should return false for non-feature subdomain when only beta host is allowed', () => {
    const betaAllowedUris = ['https://beta.dev01.devland.is/minarsidur']
    expect(
      validateUri(
        'https://evil-beta.staging01.devland.is/minarsidur',
        betaAllowedUris,
      ),
    ).toBe(false)
  })

  it('should return false for arbitrary-prefix hostname when beta host is allowed', () => {
    // "evil.sub" contains a dot — not a valid DNS slug — so it must be rejected
    // even though the full hostname ends with "-beta.dev01.devland.is".
    const betaAllowedUris = ['https://beta.dev01.devland.is/stjornbord']
    expect(
      validateUri(
        'https://evil.sub-beta.dev01.devland.is/stjornbord',
        betaAllowedUris,
      ),
    ).toBe(false)
  })
})

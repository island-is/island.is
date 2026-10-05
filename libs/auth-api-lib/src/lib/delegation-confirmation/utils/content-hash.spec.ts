import {
  CONTENT_HASH_ALG,
  canonicalizeForHash,
  hashConfirmationContent,
} from './content-hash'
import type { ConfirmationContentSnapshot } from '../types/delegation-confirmation-content'

const snapshot = (
  overrides: Partial<ConfirmationContentSnapshot> = {},
): ConfirmationContentSnapshot => ({
  version: 1,
  fromNationalId: '1234567890',
  toNationalId: '0987654321',
  toName: 'Jón Jónsson',
  domainName: '@island.is',
  domainDisplayName: 'Ísland.is',
  scopes: [
    {
      name: '@island.is/finances/schedule',
      displayName: 'Greiðsluáætlun',
      validTo: '2027-01-01T00:00:00.000Z',
    },
  ],
  requestedAt: '2026-08-19T12:00:00.000Z',
  locale: 'is',
  bindingMessage: 'Umboð til Jón Jónsson · 1 heimild',
  ...overrides,
})

describe('canonicalizeForHash', () => {
  it('sorts object keys', () => {
    expect(canonicalizeForHash({ b: 1, a: 2 })).toEqual('{"a":2,"b":1}')
  })

  it('preserves array order', () => {
    expect(canonicalizeForHash([3, 1, 2])).toEqual('[3,1,2]')
  })

  it('emits no insignificant whitespace', () => {
    expect(canonicalizeForHash({ a: [1, { b: 'c' }] })).toEqual(
      '{"a":[1,{"b":"c"}]}',
    )
  })

  it('omits undefined properties', () => {
    expect(canonicalizeForHash({ a: 1, b: undefined } as never)).toEqual(
      '{"a":1}',
    )
  })

  it('normalises strings to NFC', () => {
    // "Ísland" with a precomposed Í vs. a combining acute accent.
    const precomposed = 'Ísland'
    const decomposed = 'Ísland'

    expect(precomposed).not.toEqual(decomposed)
    expect(canonicalizeForHash(decomposed)).toEqual(
      canonicalizeForHash(precomposed),
    )
  })

  it('refuses non-integer numbers', () => {
    expect(() => canonicalizeForHash(1.5)).toThrow(/non-integer number/)
  })

  it('refuses non-finite numbers', () => {
    expect(() => canonicalizeForHash(Number.NaN)).toThrow(/non-integer number/)
    expect(() => canonicalizeForHash(Number.POSITIVE_INFINITY)).toThrow(
      /non-integer number/,
    )
  })
})

describe('hashConfirmationContent', () => {
  // Pinned literal. Recomputing the expectation would let a canonicalisation
  // change pass its own test, and this digest is long-term evidence.
  const expectedHash =
    '0f5f3176c6db34ee6a4a2e503deee6d910829be0ab65f7d17a0375ea5d4389da'

  it('is stable for the same content', () => {
    expect(hashConfirmationContent(snapshot())).toEqual(
      hashConfirmationContent(snapshot()),
    )
  })

  it('ignores property insertion order', () => {
    const reordered = {
      bindingMessage: 'Umboð til Jón Jónsson · 1 heimild',
      locale: 'is',
      requestedAt: '2026-08-19T12:00:00.000Z',
      scopes: snapshot().scopes,
      domainDisplayName: 'Ísland.is',
      domainName: '@island.is',
      toName: 'Jón Jónsson',
      toNationalId: '0987654321',
      fromNationalId: '1234567890',
      version: 1,
    } as ConfirmationContentSnapshot

    expect(hashConfirmationContent(reordered)).toEqual(
      hashConfirmationContent(snapshot()),
    )
  })

  it('ignores unicode representation of the same text', () => {
    expect(
      hashConfirmationContent(snapshot({ domainDisplayName: 'Ísland.is' })),
    ).toEqual(hashConfirmationContent(snapshot()))
  })

  it('changes when the recipient changes', () => {
    expect(
      hashConfirmationContent(snapshot({ toNationalId: '0987654322' })),
    ).not.toEqual(hashConfirmationContent(snapshot()))
  })

  it('changes when a scope validity changes', () => {
    expect(
      hashConfirmationContent(
        snapshot({
          scopes: [
            {
              ...snapshot().scopes[0],
              validTo: '2028-01-01T00:00:00.000Z',
            },
          ],
        }),
      ),
    ).not.toEqual(hashConfirmationContent(snapshot()))
  })

  it('changes when a scope is added', () => {
    expect(
      hashConfirmationContent(
        snapshot({
          scopes: [
            ...snapshot().scopes,
            {
              name: '@island.is/health/records',
              displayName: 'Sjúkraskrá',
              validTo: '2027-01-01T00:00:00.000Z',
            },
          ],
        }),
      ),
    ).not.toEqual(hashConfirmationContent(snapshot()))
  })

  it('changes when the message shown on the phone changes', () => {
    expect(
      hashConfirmationContent(
        snapshot({ bindingMessage: 'Umboð til Jón Jónsson · 2 heimildir' }),
      ),
    ).not.toEqual(hashConfirmationContent(snapshot()))
  })

  it('matches the pinned digest', () => {
    expect(CONTENT_HASH_ALG).toEqual('sha256')
    expect(hashConfirmationContent(snapshot())).toEqual(expectedHash)
  })
})

import { decodeRouterPath } from './decodeRouterPath'

describe('decodeRouterPath', () => {
  it('decodes encoded characters like react-router does', () => {
    expect(decodeRouterPath('/tenant/%4064artic.is/rettindi')).toBe(
      '/tenant/@64artic.is/rettindi',
    )
  })

  it('keeps encoded slashes inside a segment as %2F', () => {
    expect(decodeRouterPath('/rettindi/%4064artic.is%2Fgg-01-test')).toBe(
      '/rettindi/@64artic.is%2Fgg-01-test',
    )
  })

  it('only decodes one level of encoding', () => {
    expect(decodeRouterPath('/tenant/foo%2540bar')).toBe('/tenant/foo%40bar')
  })

  it('returns the raw pathname when a segment is malformed', () => {
    expect(decodeRouterPath('/tenant/foo%ZZbar/%40ok')).toBe(
      '/tenant/foo%ZZbar/%40ok',
    )
  })

  it('leaves already-decoded pathnames unchanged', () => {
    expect(decodeRouterPath('/tenant/@64artic.is/rettindi')).toBe(
      '/tenant/@64artic.is/rettindi',
    )
  })
})

import {
  extractOrganizationSlugFromPathname,
  getHeaderNavigationPropsFromUrl,
  pathIsProjectPage,
} from './organization'

describe('pathIsProjectPage', () => {
  it('detects Icelandic project pages under /v/', () => {
    expect(pathIsProjectPage('/v/thjodaratkvaedagreidsla-2026')).toBe(true)
  })

  it('detects English project pages under /en/p/', () => {
    expect(pathIsProjectPage('/en/p/thjodaratkvaedagreidsla-2026')).toBe(true)
  })

  it('strips query and hash before resolving', () => {
    expect(pathIsProjectPage('/v/thjodaratkvaedagreidsla-2026?foo=bar#x')).toBe(
      true,
    )
  })

  it('detects project subpaths', () => {
    expect(pathIsProjectPage('/v/some-project/frett')).toBe(true)
  })

  it('returns false for the front page', () => {
    expect(pathIsProjectPage('/')).toBe(false)
  })

  it('returns false for a news article', () => {
    expect(pathIsProjectPage('/frett/einhver-frett')).toBe(false)
  })

  it('returns false for an organization page', () => {
    expect(pathIsProjectPage('/s/blodbankinn')).toBe(false)
  })
})

describe('extractOrganizationSlugFromPathname', () => {
  it('extracts the slug from an Icelandic org page under /s/', () => {
    expect(extractOrganizationSlugFromPathname('/s/blodbankinn', 'is')).toBe(
      'blodbankinn',
    )
  })

  it('extracts the slug from an English org page under /en/o/', () => {
    expect(extractOrganizationSlugFromPathname('/en/o/blodbankinn', 'en')).toBe(
      'blodbankinn',
    )
  })

  it('returns an empty string for the front page', () => {
    expect(extractOrganizationSlugFromPathname('/', 'is')).toBe('')
  })

  it('returns an empty string for a news article', () => {
    expect(
      extractOrganizationSlugFromPathname('/frett/einhver-frett', 'is'),
    ).toBe('')
  })
})

describe('getHeaderNavigationPropsFromUrl', () => {
  it.each([
    ['/s/blodbankinn', 'is', 'blodbankinn'],
    ['/en/o/blodbankinn', 'en', 'blodbankinn'],
    ['/_next/data/build-id/s/blodbankinn.json', 'is', 'blodbankinn'],
    ['/v/thjodaratkvaedagreidsla-2026', 'is', ''],
    ['/en/p/thjodaratkvaedagreidsla-2026', 'en', ''],
    ['/_next/data/build-id/en/p/thjodaratkvaedagreidsla-2026.json', 'en', ''],
  ] as const)(
    'hides navigation for %s',
    (url, locale, organizationSearchFilter) => {
      expect(getHeaderNavigationPropsFromUrl(url, locale)).toEqual({
        organizationSearchFilter,
        showHeaderNavigation: false,
      })
    },
  )

  it.each(['/', '/frett/einhver-frett'])('shows navigation for %s', (url) => {
    expect(getHeaderNavigationPropsFromUrl(url, 'is')).toEqual({
      organizationSearchFilter: '',
      showHeaderNavigation: true,
    })
  })
})

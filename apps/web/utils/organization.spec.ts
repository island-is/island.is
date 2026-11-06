import {
  extractOrganizationSlugFromPathname,
  extractProjectSlugFromPathname,
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

describe('extractProjectSlugFromPathname', () => {
  it.each([
    ['/v/some-project', 'some-project'],
    ['/en/p/some-project', 'some-project'],
    ['/v/some-project/some-subpage', 'some-project'],
    ['/en/p/some-project/some-subpage?foo=bar', 'some-project'],
    ['/', ''],
    ['/s/blodbankinn', ''],
  ])('extracts the slug from %s', (pathname, slug) => {
    expect(extractProjectSlugFromPathname(pathname)).toBe(slug)
  })
})

describe('getHeaderNavigationPropsFromUrl', () => {
  it.each([
    ['/s/blodbankinn', 'is', 'blodbankinn', ''],
    ['/en/o/blodbankinn', 'en', 'blodbankinn', ''],
    ['/_next/data/build-id/s/blodbankinn.json', 'is', 'blodbankinn', ''],
    [
      '/v/thjodaratkvaedagreidsla-2026',
      'is',
      '',
      'thjodaratkvaedagreidsla-2026',
    ],
    [
      '/en/p/thjodaratkvaedagreidsla-2026',
      'en',
      '',
      'thjodaratkvaedagreidsla-2026',
    ],
    [
      '/_next/data/build-id/en/p/thjodaratkvaedagreidsla-2026.json',
      'en',
      '',
      'thjodaratkvaedagreidsla-2026',
    ],
  ] as const)(
    'hides navigation for %s',
    (url, locale, organizationSearchFilter, projectSearchFilter) => {
      expect(getHeaderNavigationPropsFromUrl(url, locale)).toEqual({
        organizationSearchFilter,
        projectSearchFilter,
        showHeaderNavigation: false,
      })
    },
  )

  it.each(['/', '/frett/einhver-frett'])('shows navigation for %s', (url) => {
    expect(getHeaderNavigationPropsFromUrl(url, 'is')).toEqual({
      organizationSearchFilter: '',
      projectSearchFilter: '',
      showHeaderNavigation: true,
    })
  })
})

import { Locale } from '@island.is/shared/types'

import {
  extractOrganizationSlugFromPathname,
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
    expect(
      pathIsProjectPage('/v/thjodaratkvaedagreidsla-2026?foo=bar#x'),
    ).toBe(true)
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
    expect(
      extractOrganizationSlugFromPathname('/en/o/blodbankinn', 'en'),
    ).toBe('blodbankinn')
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

describe('header simplified-header rule', () => {
  // Mirrors the layout's condition in main.tsx without importing it:
  //   organizationSearchFilter = extractOrganizationSlugFromPathname(path, locale)
  //   showHeaderNavigation = !organizationSearchFilter && !pathIsProjectPage(path)
  const showHeaderNavigation = (path: string, locale: Locale): boolean => {
    const organizationSearchFilter = extractOrganizationSlugFromPathname(
      path,
      locale,
    )
    return !organizationSearchFilter && !pathIsProjectPage(path)
  }

  it('hides navigation on organization (stofnanavefir) pages', () => {
    expect(showHeaderNavigation('/s/blodbankinn', 'is')).toBe(false)
  })

  it('hides navigation on project (verkefni) pages', () => {
    expect(
      showHeaderNavigation('/v/thjodaratkvaedagreidsla-2026', 'is'),
    ).toBe(false)
  })

  it('shows navigation on the front page', () => {
    expect(showHeaderNavigation('/', 'is')).toBe(true)
  })

  it('shows navigation on a news article', () => {
    expect(showHeaderNavigation('/frett/einhver-frett', 'is')).toBe(true)
  })
})

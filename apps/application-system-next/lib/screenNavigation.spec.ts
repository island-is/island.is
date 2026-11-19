import {
  buildScreenUrl,
  getHistoryAction,
  readScreenIdFromSearch,
} from './screenNavigation'

describe('getHistoryAction', () => {
  describe('source: url', () => {
    it('leaves the address bar alone when the requested screen is shown', () => {
      expect(
        getHistoryAction({
          source: 'url',
          requestedId: 'page-2',
          responseId: 'page-2',
        }),
      ).toBe('none')
    })

    it('replaces it when the server showed a different screen', () => {
      expect(
        getHistoryAction({
          source: 'url',
          requestedId: 'gone',
          responseId: 'page-2',
        }),
      ).toBe('replace')
    })

    it('replaces it when the address bar named no screen', () => {
      expect(getHistoryAction({ source: 'url', responseId: 'page-2' })).toBe(
        'replace',
      )
    })
  })

  describe('source: navigation', () => {
    it('pushes when the screen changed', () => {
      expect(
        getHistoryAction({
          source: 'navigation',
          currentId: 'page-1',
          responseId: 'page-2',
          hasNotice: false,
        }),
      ).toBe('push')
    })

    it('leaves the address bar alone when the screen did not change', () => {
      expect(
        getHistoryAction({
          source: 'navigation',
          currentId: 'page-1',
          responseId: 'page-1',
          hasNotice: false,
        }),
      ).toBe('none')
    })

    it('replaces when the response carries a notice', () => {
      expect(
        getHistoryAction({
          source: 'navigation',
          currentId: 'page-1',
          responseId: 'page-2',
          hasNotice: true,
        }),
      ).toBe('replace')
    })

    it('replaces on a notice even when the screen id is unchanged', () => {
      expect(
        getHistoryAction({
          source: 'navigation',
          currentId: 'page-1',
          responseId: 'page-1',
          hasNotice: true,
        }),
      ).toBe('replace')
    })
  })
})

describe('buildScreenUrl', () => {
  it('sets the screen parameter and keeps the path, other parameters and hash', () => {
    expect(
      buildScreenUrl(
        'https://island.is/umsoknir/app/123?lang=en#top',
        'page-2',
      ),
    ).toBe('/umsoknir/app/123?lang=en&screen=page-2#top')
  })

  it('replaces an existing screen parameter', () => {
    expect(
      buildScreenUrl('https://island.is/umsoknir/app/123?screen=a', 'b'),
    ).toBe('/umsoknir/app/123?screen=b')
  })

  it('encodes ids that are not URL-safe', () => {
    expect(buildScreenUrl('https://island.is/app', 'a b&c')).toBe(
      '/app?screen=a+b%26c',
    )
  })
})

describe('readScreenIdFromSearch', () => {
  it('reads the screen parameter', () => {
    expect(readScreenIdFromSearch('?lang=en&screen=page-2')).toBe('page-2')
  })

  it('returns undefined when there is none', () => {
    expect(readScreenIdFromSearch('?lang=en')).toBeUndefined()
    expect(readScreenIdFromSearch('')).toBeUndefined()
  })
})

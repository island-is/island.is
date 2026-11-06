import {
  buildApplicationSystemRootUrl,
  buildBffLoginUrl,
  buildLoginHandoffUrl,
  buildProtectedApplicationUrl,
} from './authRedirect'

describe('auth redirect helpers', () => {
  it('builds an internal login handoff url for a protected application page', () => {
    const target = buildProtectedApplicationUrl({
      host: 'localhost:4250',
      protocol: 'http',
      slug: 'example-inputs',
      id: 'app-1',
      step: 2,
    })

    expect(target).toBe(
      'http://localhost:4250/umsoknir/example-inputs/app-1?step=2',
    )
    expect(buildLoginHandoffUrl(target)).toBe(
      '/auth/login?target_link_uri=http%3A%2F%2Flocalhost%3A4250%2Fumsoknir%2Fexample-inputs%2Fapp-1%3Fstep%3D2',
    )
  })

  it('builds the bff login url from the handoff target', () => {
    expect(
      buildBffLoginUrl(
        'http://localhost:4250/umsoknir/example-inputs/app-1?step=2',
      ),
    ).toBe(
      '/bff/login?target_link_uri=http%3A%2F%2Flocalhost%3A4250%2Fumsoknir%2Fexample-inputs%2Fapp-1%3Fstep%3D2',
    )
  })

  describe('buildApplicationSystemRootUrl', () => {
    it('uses http on localhost', () => {
      expect(buildApplicationSystemRootUrl({ host: 'localhost:4250' })).toBe(
        'http://localhost:4250/umsoknir',
      )
    })

    it('uses https on other hosts', () => {
      expect(buildApplicationSystemRootUrl({ host: 'island.is' })).toBe(
        'https://island.is/umsoknir',
      )
    })

    it('uses the given protocol', () => {
      expect(
        buildApplicationSystemRootUrl({
          host: 'beta.dev01.devland.is',
          protocol: 'http',
        }),
      ).toBe('http://beta.dev01.devland.is/umsoknir')
    })

    it('returns only the path without a host', () => {
      expect(buildApplicationSystemRootUrl({})).toBe('/umsoknir')
    })
  })
})

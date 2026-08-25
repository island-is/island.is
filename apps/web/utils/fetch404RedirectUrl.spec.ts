import type {
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client'

import { linkResolver } from '../hooks'
import { fetch404RedirectUrl } from './fetch404RedirectUrl'

jest.mock('../hooks', () => ({
  linkResolver: jest.fn(),
  LinkType: {},
}))

jest.mock('../screens/queries', () => ({
  GET_URL_QUERY: 'GET_URL_QUERY',
}))

// Returns a getUrl payload keyed by the requested language, so a lookup in a
// language that has no entry resolves to null (mirrors the CMS, where redirect
// entries only exist under the default locale).
const clientReturning = (byLang: Record<string, unknown>) => {
  const query = jest.fn(async ({ variables }: { variables: { input: { lang: string } } }) => ({
    data: { getUrl: byLang[variables.input.lang] ?? null },
  }))
  return {
    client: { query } as unknown as ApolloClient<NormalizedCacheObject>,
    query,
  }
}

describe('fetch404RedirectUrl', () => {
  beforeEach(() => jest.clearAllMocks())

  it('resolves an explicit redirect that only exists in the default locale for a non-default-locale page', async () => {
    const { client, query } = clientReturning({
      is: {
        page: null,
        explicitRedirect: 'https://island.is/en/o/digital-iceland/services',
      },
    })

    const result = await fetch404RedirectUrl(
      client,
      '/en/o/digital-iceland/island-services/authorisation-system',
      'en',
    )

    expect(result).toBe(
      encodeURI('https://island.is/en/o/digital-iceland/services'),
    )
    // en lookup first (miss), then a default-locale (is) fallback lookup
    const langs = query.mock.calls.map((c) => c[0].variables.input.lang)
    expect(langs).toContain('en')
    expect(langs).toContain('is')
  })

  it('resolves a page redirect using the language the lookup succeeded in', async () => {
    ;(linkResolver as jest.Mock).mockReturnValue({ href: '/is/stofnanir/services' })
    const { client } = clientReturning({
      is: { page: { slug: 'services', type: 'organizationpage' }, explicitRedirect: null },
    })

    const result = await fetch404RedirectUrl(
      client,
      '/en/o/digital-iceland/island-services/authorisation-system',
      'en',
    )

    // must resolve with 'is' (where the entry was found), not the requested 'en'
    expect(linkResolver).toHaveBeenCalledWith('organizationpage', ['services'], 'is')
    expect(result).toBe(encodeURI('/is/stofnanir/services'))
  })

  it('does not fall back when the redirect is found in the requested locale', async () => {
    const { client, query } = clientReturning({
      en: { page: null, explicitRedirect: 'https://island.is/en/target' },
    })

    const result = await fetch404RedirectUrl(client, '/en/o/x/old', 'en')

    expect(result).toBe(encodeURI('https://island.is/en/target'))
    const langs = query.mock.calls.map((c) => c[0].variables.input.lang)
    expect(langs).not.toContain('is')
  })

  it('returns null when no redirect exists in any locale', async () => {
    const { client } = clientReturning({})
    const result = await fetch404RedirectUrl(client, '/en/o/x/missing', 'en')
    expect(result).toBeNull()
  })
})

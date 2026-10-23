import { parse } from 'querystring'

import { resolveLegacyRedirect } from '.'

const mockCmsUrls: Record<string, string> = {
  '/redirects/landsrettur.is/domar-og-urskurdir/domur-urskurdur?verdictid=000629f1-bf85-4bd5-8780-7e97b7274267':
    '/domar/g-ddd4223d-1624-4592-af53-80cbd967273d',
  '/redirects/haestirettur.is/domar?nr=10038':
    '/domar?court=Hæstiréttur&number=501/2016',
}
const mockExistingVerdicts = ['g-1079d456-805f-4ac2-9b25-f362c9a18011']
const mockQuery = jest.fn()

jest.mock('../../graphql/client', () => () => ({ query: mockQuery }))

beforeEach(() => {
  mockQuery.mockReset()
  mockQuery.mockImplementation(async ({ variables: { input } }) => ({
    data: {
      getUrl: mockCmsUrls[input.slug]
        ? { explicitRedirect: mockCmsUrls[input.slug] }
        : null,
      webVerdictById: mockExistingVerdicts.includes(input.id)
        ? { item: { caseNumber: '1/2020' } }
        : null,
      webVerdicts: { items: [], total: 0 },
    },
  }))
})

const resolve = (url: string) => {
  const [path, query = ''] = url.split('?')
  return resolveLegacyRedirect(path.split('/'), parse(query))
}

describe('resolveLegacyRedirect', () => {
  it('redirects to the CMS url entry of an old id', async () => {
    expect(
      await resolve(
        'www.landsrettur.is/domar-og-urskurdir/domur?VerdictId=000629F1-BF85-4BD5-8780-7E97B7274267',
      ),
    ).toEqual({
      destination: '/domar/g-ddd4223d-1624-4592-af53-80cbd967273d',
      permanent: true,
    })
  })

  it('encodes the CMS explicit redirect', async () => {
    expect(await resolve('haestirettur.is/domar?nr=10038')).toEqual({
      destination: '/domar?court=H%C3%A6stir%C3%A9ttur&number=501/2016',
      permanent: true,
    })
  })

  it('falls back to a GoPro id when the old id is not in the CMS', async () => {
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=1079d456-805f-4ac2-9b25-f362c9a18011',
      ),
    ).toEqual({
      destination: '/domar/g-1079d456-805f-4ac2-9b25-f362c9a18011',
      permanent: true,
    })
  })

  it('falls back to the verdict list when the CMS lookup fails', async () => {
    mockQuery.mockRejectedValue(new Error('CMS down'))
    expect(
      await resolve(
        'landsrettur.is/domar-og-urskurdir/domur-urskurdur?verdictid=000629f1-bf85-4bd5-8780-7e97b7274267',
      ),
    ).toEqual({ destination: '/domar?court=landsrettur', permanent: false })
  })

  it('falls back to the verdict list by case number for district court searches', async () => {
    expect(await resolve('domstolar.is/domaleit/nanar?id=E200500321')).toEqual({
      destination:
        '/domar?court=H%C3%A9ra%C3%B0sd%C3%B3mst%C3%B3lar&number=E-321%2F2005',
      permanent: false,
    })
  })

  it('ignores hosts without a handler', async () => {
    expect(await resolve('example.is/domar/domur?id=1')).toBeNull()
  })
})

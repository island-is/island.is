import { parse } from 'querystring'

import { resolveLegacyRedirect } from './index'

const mockExistingVerdicts = ['g-1079d456-805f-4ac2-9b25-f362c9a18011']
const mockQuery = jest.fn()

jest.mock('../../graphql/client', () => () => ({ query: mockQuery }))

beforeEach(() => {
  mockQuery.mockReset()
  mockQuery.mockImplementation(async ({ variables: { input } }) => ({
    data: {
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
  it('redirects an old id to the verdict it stood for', async () => {
    expect(
      await resolve(
        'www.landsrettur.is/domar-og-urskurdir/domur?VerdictId=000629F1-BF85-4BD5-8780-7E97B7274267',
      ),
    ).toEqual({
      destination: '/domar/g-ddd4223d-1624-4592-af53-80cbd967273d',
      permanent: true,
    })
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('redirects supreme court ids directly', async () => {
    expect(
      await resolve(
        'haestirettur.is/domar/domur?id=ab5c9564-375f-40df-8f1f-df1ded4e3e0b',
      ),
    ).toEqual({
      destination: '/domar/s-AB5C9564-375F-40DF-8F1F-DF1DED4E3E0B',
      permanent: true,
    })
  })

  it('looks the verdict up by case number when it has no island.is id', async () => {
    mockQuery.mockResolvedValue({
      data: {
        webVerdicts: {
          items: [{ id: 'g-new', caseNumber: 'S-73/2019' }],
          total: 1,
        },
      },
    })
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=001edf71-c2e3-4953-a118-87c04e8dc27e',
      ),
    ).toEqual({ destination: '/domar/g-new', permanent: true })
  })

  it('falls back to a GoPro id when the old id is unknown', async () => {
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=1079d456-805f-4ac2-9b25-f362c9a18011',
      ),
    ).toEqual({
      destination: '/domar/g-1079d456-805f-4ac2-9b25-f362c9a18011',
      permanent: true,
    })
  })

  it('falls back to the verdict list when the lookup fails', async () => {
    mockQuery.mockRejectedValue(new Error('API down'))
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=1079d456-805f-4ac2-9b25-f362c9a18011',
      ),
    ).toEqual({
      destination: '/domar?court=H%C3%A9ra%C3%B0sd%C3%B3mst%C3%B3lar',
      permanent: false,
    })
  })

  it('checks the GoPro id when the case number lookup fails', async () => {
    mockQuery.mockImplementation(async ({ variables: { input } }) => {
      if (input.caseNumber) throw new Error('API down')
      return { data: { webVerdictById: { item: { caseNumber: 'S-73/2019' } } } }
    })
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=001edf71-c2e3-4953-a118-87c04e8dc27e',
      ),
    ).toEqual({
      destination: '/domar/g-001edf71-c2e3-4953-a118-87c04e8dc27e',
      permanent: true,
    })
  })

  it('falls back to the verdict list when the lookup takes too long', async () => {
    jest.useFakeTimers()
    try {
      mockQuery.mockReturnValue(new Promise(() => undefined))
      const result = resolve(
        'heradsdomstolar.is/domar/domur?id=1079d456-805f-4ac2-9b25-f362c9a18011',
      )
      await jest.advanceTimersByTimeAsync(3000)
      expect(await result).toEqual({
        destination: '/domar?court=H%C3%A9ra%C3%B0sd%C3%B3mst%C3%B3lar',
        permanent: false,
      })
    } finally {
      jest.useRealTimers()
    }
  })

  it('falls back to the verdict list by case number for district court searches', async () => {
    expect(await resolve('domstolar.is/domaleit/nanar?id=E200500321')).toEqual({
      destination:
        '/domar?court=H%C3%A9ra%C3%B0sd%C3%B3mst%C3%B3lar&number=E-321%2F2005',
      permanent: false,
    })
  })

  it('does not treat object prototype keys as old ids', async () => {
    expect(await resolve('haestirettur.is/domar?nr=constructor')).toEqual({
      destination: '/domar?court=H%C3%A6stir%C3%A9ttur',
      permanent: false,
    })
  })

  it('ignores hosts without a handler', async () => {
    expect(await resolve('example.is/domar/domur?id=1')).toBeNull()
  })
})

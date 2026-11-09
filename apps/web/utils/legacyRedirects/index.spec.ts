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
      permanent: false,
    })
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('redirects old court of appeal verdict page aliases, ids and documents', async () => {
    const destination = {
      destination: '/domar/g-ace72905-4493-4845-98c4-539b440bfdb7',
      permanent: false,
    }
    expect(
      await resolve(
        'landsrettur.is?PageId=347c3bb1-8926-11e5-80c6-005056bc6a40&Id=9c738c6d-e995-4cb6-98f6-bb1553ae138c&verdictid=de7e5954-51b6-406b-a1eb-863b9323e66d',
      ),
    ).toEqual(destination)
    expect(
      await resolve(
        'landsrettur.is/domar-og-urskurdir/domur-urskurdur?Id=9c738c6d-e995-4cb6-98f6-bb1553ae138c',
      ),
    ).toEqual(destination)
    expect(
      await resolve(
        'landsrettur.is/domar-og-urskurdir/domur-urskurdur/$Verdict/Download?docId=cc7092af-1853-418e-8bc8-5e4a8e61af43',
      ),
    ).toEqual(destination)
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('redirects district court ids that are not GoPro ids', async () => {
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=8c6deda8-a73c-4764-be7e-aa475db8cb8e',
      ),
    ).toEqual({
      destination: '/domar/g-78b5e567-eb3e-440a-9f88-afaee7178710',
      permanent: false,
    })
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('redirects supreme court determinations, also when their id changed', async () => {
    expect(
      await resolve(
        'haestirettur.is/akvardanir/_malskotsbeidni?id=baa796f3-6175-4bcc-8dd5-1b410040bf4e',
      ),
    ).toEqual({
      destination:
        '/s/haestirettur/akvardanir/EA844C6E-DA91-4701-8EBD-782B500E1C29',
      permanent: false,
    })
    expect(
      await resolve(
        'haestirettur.is/akvardanir/_malskotsbeidni?id=2a353e9f-83e6-4839-8036-47e32d2e45d4',
      ),
    ).toEqual({
      destination:
        '/s/haestirettur/akvardanir/2A353E9F-83E6-4839-8036-47E32D2E45D4',
      permanent: false,
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
      permanent: false,
    })
  })

  it('redirects supreme court verdicts whose id changed on island.is', async () => {
    expect(
      await resolve(
        'haestirettur.is/domar/_domur?id=2872e8c7-3685-400f-812b-aa2416bb0cd6',
      ),
    ).toEqual({
      destination: '/domar/s-688E1AF4-FCCC-4B6C-A0C5-D3613D701D6D',
      permanent: false,
    })
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('looks the verdict up by case number when it has no island.is id', async () => {
    mockQuery.mockResolvedValue({
      data: {
        webVerdicts: {
          items: [{ id: 'g-new', caseNumber: 'S-307/2026' }],
          total: 1,
        },
      },
    })
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=acaac419-53b5-441d-b269-68fff8ff1109',
      ),
    ).toEqual({ destination: '/domar/g-new', permanent: false })
  })

  it('falls back to a GoPro id when the old id is unknown', async () => {
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=1079d456-805f-4ac2-9b25-f362c9a18011',
      ),
    ).toEqual({
      destination: '/domar/g-1079d456-805f-4ac2-9b25-f362c9a18011',
      permanent: false,
    })
  })

  it('is not found when the old id is unknown', async () => {
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=00000000-0000-0000-0000-000000000000',
      ),
    ).toEqual({ notFound: true })
    expect(
      await resolve(
        'landsrettur.is/domar-og-urskurdir/domur-urskurdur?verdictid=00000000-0000-0000-0000-000000000000',
      ),
    ).toEqual({ notFound: true })
  })

  it('is not found when no verdict has the case number', async () => {
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=acaac419-53b5-441d-b269-68fff8ff1109',
      ),
    ).toEqual({ notFound: true })
  })

  it('goes to the verdict list by case number when several verdicts match', async () => {
    mockQuery.mockResolvedValue({
      data: {
        webVerdicts: {
          items: [
            { id: 'g-1', caseNumber: 'E-321/2005' },
            { id: 'g-2', caseNumber: 'E-321/2005' },
          ],
          total: 2,
        },
      },
    })
    expect(await resolve('domstolar.is/domaleit/nanar?id=E200500321')).toEqual({
      destination:
        '/domar?court=H%C3%A9ra%C3%B0sd%C3%B3mst%C3%B3lar&number=E-321%2F2005',
      permanent: false,
    })
  })

  it('goes to the verdict list for links to the old verdict lists', async () => {
    expect(await resolve('haestirettur.is/domar')).toEqual({
      destination: '/domar?court=H%C3%A6stir%C3%A9ttur',
      permanent: false,
    })
  })

  it('is unavailable when the lookup fails', async () => {
    mockQuery.mockRejectedValue(new Error('API down'))
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=1079d456-805f-4ac2-9b25-f362c9a18011',
      ),
    ).toEqual({ unavailable: true })
  })

  it('checks the GoPro id when the case number lookup fails', async () => {
    mockQuery.mockImplementation(async ({ variables: { input } }) => {
      if (input.caseNumber) throw new Error('API down')
      return {
        data: { webVerdictById: { item: { caseNumber: 'S-307/2026' } } },
      }
    })
    expect(
      await resolve(
        'heradsdomstolar.is/domar/domur?id=acaac419-53b5-441d-b269-68fff8ff1109',
      ),
    ).toEqual({
      destination: '/domar/g-acaac419-53b5-441d-b269-68fff8ff1109',
      permanent: false,
    })
  })

  it('is unavailable when the lookup takes too long', async () => {
    jest.useFakeTimers()
    try {
      mockQuery.mockReturnValue(new Promise(() => undefined))
      const result = resolve(
        'heradsdomstolar.is/domar/domur?id=1079d456-805f-4ac2-9b25-f362c9a18011',
      )
      await jest.advanceTimersByTimeAsync(9999)
      let settled = false
      result.then(() => (settled = true))
      await Promise.resolve()
      expect(settled).toBe(false)
      await jest.advanceTimersByTimeAsync(1)
      expect(await result).toEqual({ unavailable: true })
    } finally {
      jest.useRealTimers()
    }
  })

  it('does not treat object prototype keys as old ids', async () => {
    expect(await resolve('haestirettur.is/domar?nr=constructor')).toEqual({
      notFound: true,
    })
  })

  it('ignores hosts without a handler', async () => {
    expect(await resolve('example.is/domar/domur?id=1')).toBeNull()
  })
})

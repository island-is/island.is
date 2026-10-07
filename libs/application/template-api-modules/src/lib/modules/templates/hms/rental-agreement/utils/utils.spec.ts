import {
  fetchFinancialIndexationForMonths,
  listOfLastMonths,
  numberOfIndexMonthsToFetch,
} from './utils'

describe('listOfLastMonths', () => {
  it.each([
    '2023-01-15T09:00:00.000Z',
    '2026-09-22T09:00:00.000Z',
    '2030-06-15T09:00:00.000Z',
    '2040-12-01T09:00:00.000Z',
  ])('reaches back to 2023M01 regardless of the current date (%s)', (iso) => {
    const months = listOfLastMonths(new Date(iso))
    expect(months).toContain('2023M01')
  })

  it('starts two months ahead so newly published future indexes are included', () => {
    const months = listOfLastMonths(new Date('2026-04-30T09:00:00.000Z'))
    expect(months[0]).toBe('2026M06')
  })
})

describe('numberOfIndexMonthsToFetch', () => {
  it('grows over time instead of staying fixed', () => {
    const monthsNeededNow = numberOfIndexMonthsToFetch(
      new Date('2026-09-22T09:00:00.000Z'),
    )
    const monthsNeededOneYearLater = numberOfIndexMonthsToFetch(
      new Date('2027-09-22T09:00:00.000Z'),
    )
    expect(monthsNeededOneYearLater).toBeGreaterThan(monthsNeededNow)
  })
})

describe('fetchFinancialIndexationForMonths', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('filters requested months to values published in Hagstofa metadata', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          variables: [
            {
              code: 'Mánuður',
              values: ['2026M05', '2026M06'],
            },
          ],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              key: ['2026M05', 'financial_indexation'],
              values: ['678.3'],
            },
            {
              key: ['2026M06', 'financial_indexation'],
              values: ['683.8'],
            },
          ],
        }),
      } as Response)

    const result = await fetchFinancialIndexationForMonths([
      '2026M07',
      '2026M06',
      '2026M05',
    ])

    expect(result).toEqual([
      { month: new Date(2026, 4, 1), value: '678.3' },
      { month: new Date(2026, 5, 1), value: '683.8' },
    ])

    const postOptions = fetchMock.mock.calls[1][1]
    const postBody = JSON.parse(postOptions?.body as string)

    expect(postBody.query[0].selection.values).toEqual(['2026M06', '2026M05'])
  })

  it('does not post to Hagstofa when none of the requested months are published', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        variables: [
          {
            code: 'Mánuður',
            values: ['2026M05'],
          },
        ],
      }),
    } as Response)

    await expect(
      fetchFinancialIndexationForMonths(['2026M07']),
    ).resolves.toEqual([])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws a clear error when Hagstofa metadata does not include months', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        variables: [
          {
            code: 'Vísitala',
            values: ['financial_indexation'],
          },
        ],
      }),
    } as Response)

    await expect(
      fetchFinancialIndexationForMonths(['2026M06']),
    ).rejects.toThrow('Missing Mánuður variable in Hagstofa metadata response')
  })
})

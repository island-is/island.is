import { fetchFinancialIndexationForMonths, listOfLastMonths } from './utils'

describe('listOfLastMonths', () => {
  it('starts two months ahead so newly published future indexes are included', () => {
    expect(listOfLastMonths(6, new Date('2026-04-30T09:00:00.000Z'))).toEqual([
      '2026M06',
      '2026M05',
      '2026M04',
      '2026M03',
      '2026M02',
      '2026M01',
    ])
  })

  it('handles year boundaries', () => {
    expect(listOfLastMonths(4, new Date('2026-12-15T09:00:00.000Z'))).toEqual([
      '2027M02',
      '2027M01',
      '2026M12',
      '2026M11',
    ])
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
      { month: new Date(2026, 4, 1), value: 678.3 },
      { month: new Date(2026, 5, 1), value: 683.8 },
    ])

    const postOptions = fetchMock.mock.calls[1][1]
    const postBody = JSON.parse(postOptions?.body as string)

    expect(postBody.query[0].selection.values).toEqual([
      '2026M06',
      '2026M05',
    ])
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

    await expect(fetchFinancialIndexationForMonths(['2026M07'])).resolves.toEqual(
      [],
    )
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

    await expect(fetchFinancialIndexationForMonths(['2026M06'])).rejects.toThrow(
      'Missing Mánuður variable in Hagstofa metadata response',
    )
  })
})

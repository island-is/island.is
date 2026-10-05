import type {
  AggregateStatisticsDto,
  StatisticsCompanyCellDto,
  StatisticsRoundCellDto,
} from '@island.is/clients/directorate-of-equality-statistics'
import { toDirectorateOfEqualitySourceData } from './directorateOfEquality'
import { getMultipleStatistics } from './statistics.utils'

const generatedAt = new Date('2026-09-25T06:00:00Z')
const AS_OF = String(generatedAt.getTime())

const cell = (
  overrides: Partial<StatisticsCompanyCellDto>,
): StatisticsCompanyCellDto => ({
  region: 'Vesturland',
  size: 'LARGE',
  sector: 'FYRIRTAEKI',
  status: 'NONE',
  companies: 1,
  ...overrides,
})

const round = (
  overrides: Partial<StatisticsRoundCellDto>,
): StatisticsRoundCellDto => ({
  region: 'Vesturland',
  size: 'LARGE',
  sector: 'FYRIRTAEKI',
  round: 1,
  companies: 1,
  ...overrides,
})

const statistics = (
  overrides: Partial<AggregateStatisticsDto> = {},
): AggregateStatisticsDto => ({
  generatedAt,
  expiresAt: new Date('2026-09-26T00:00:00Z'),
  minimumCohort: 5,
  regions: ['Vesturland', 'Óþekkt'],
  companies: [
    cell({ status: 'VOTTUN', companies: 6 }),
    cell({ status: 'NONE', companies: 5 }),
    cell({ status: 'SKYRSLUGJOF', sector: 'RIKISADILI', companies: 3 }),
    // Not obliged: counts only toward voluntary, withSystem and obligedBySize.
    cell({ status: 'STADFESTING', size: 'MEDIUM', companies: 2 }),
    cell({ status: 'NONE', size: 'MEDIUM', companies: 4 }),
    cell({ status: 'VOTTUN', size: 'SMALL', companies: 1 }),
    cell({ status: 'UNCLASSIFIED', size: 'UNKNOWN', companies: 2 }),
    cell({ status: 'NONE', size: 'SMALL', companies: 9 }),
  ],
  rounds: [
    round({ round: 1, companies: 4 }),
    round({ round: 2, sector: 'SVEITARFELAG', companies: 2 }),
    round({ round: null, companies: 1 }),
    round({ round: 3, size: 'MEDIUM', companies: 5 }),
  ],
  employees: [
    { status: 'VOTTUN', employees: 1200 },
    { status: 'STADFESTING', employees: null },
    { status: 'SKYRSLUGJOF', employees: 300 },
    { status: 'UNCLASSIFIED', employees: null },
  ],
  ...overrides,
})

const single = (value: number | null) => [{ header: AS_OF, value }]

describe('toDirectorateOfEqualitySourceData', () => {
  const { data } = toDirectorateOfEqualitySourceData(statistics())

  it('counts the obliged population as LARGE companies only', () => {
    expect(data['obliged']).toEqual(single(14))
    expect(data['complied']).toEqual(single(9))
    expect(data['compliedShare']).toEqual(single(9 / 14))
  })

  it('counts covered companies outside the obliged sizes as voluntary', () => {
    expect(data['voluntary']).toEqual(single(5))
    expect(data['withSystem']).toEqual(single(14))
  })

  it('emits one single-point key per status group for the donut', () => {
    expect(data['status.legacy']).toEqual(single(6))
    expect(data['status.skyrslugjof']).toEqual(single(3))
    expect(data['status.none']).toEqual(single(5))
  })

  it('folds vottun, staðfesting and unclassified into one legacy key', () => {
    expect(data['status.vottun']).toBeUndefined()
    expect(data['status.stadfesting']).toBeUndefined()
    expect(data['status.unclassified']).toBeUndefined()
    expect(data['bySector.legacy'].map((p) => p.value)).toEqual([6, 0, 0, 0])
  })

  it('sums only published headcounts, so a withheld one cannot be derived', () => {
    expect(data['employees']).toEqual(single(1500))
    expect(data['employees.legacy']).toEqual(single(1200))
    expect(data['employees.none']).toBeUndefined()
  })

  it('gives every sector series the same headers in the same order', () => {
    const headers = ['Fyrirtæki', 'Ríkisaðilar', 'Sveitarfélög', 'Óflokkað']
    const sectorKeys = Object.keys(data).filter(
      (key) => key.startsWith('bySector.') || key.startsWith('roundBySector.'),
    )

    expect(sectorKeys.length).toBeGreaterThan(0)
    for (const key of sectorKeys) {
      expect(data[key].map((point) => point.header)).toEqual(headers)
    }
    expect(data['bySector.skyrslugjof'].map((p) => p.value)).toEqual([
      0, 3, 0, 0,
    ])
  })

  it('builds round series from obliged companies only, with a key for unknown rounds', () => {
    expect(data['roundBySector.1'].map((p) => p.value)).toEqual([4, 0, 0, 0])
    expect(data['roundBySector.2'].map((p) => p.value)).toEqual([0, 0, 2, 0])
    expect(data['roundBySector.unknown'].map((p) => p.value)).toEqual([
      1, 0, 0, 0,
    ])
    expect(data['roundBySector.3'].map((p) => p.value)).toEqual([0, 0, 0, 0])
  })

  it('splits the 25+ population by size', () => {
    expect(data['obligedBySize']).toEqual([
      { header: '50+', value: 14 },
      { header: '25–49', value: 6 },
    ])
  })

  it('returns no share when nobody is obliged, rather than dividing by zero', () => {
    const empty = toDirectorateOfEqualitySourceData(
      statistics({ companies: [], employees: [] }),
    ).data

    expect(empty['compliedShare']).toEqual(single(null))
    expect(empty['employees']).toEqual(single(null))
  })
})

describe('DoE keys through the chart pipeline', () => {
  const sourceData = (() => {
    const { data } = toDirectorateOfEqualitySourceData(statistics())
    return {
      data: Object.fromEntries(
        Object.entries(data).map(([key, points]) => [`doe.${key}`, points]),
      ),
    }
  })()

  it('keeps sector series merged and in order on a bar chart', async () => {
    const result = await getMultipleStatistics(
      { sourceDataKeys: ['doe.bySector.legacy', 'doe.bySector.none'] },
      sourceData,
    )

    expect(result.map((item) => item.header)).toEqual([
      'Fyrirtæki',
      'Ríkisaðilar',
      'Sveitarfélög',
      'Óflokkað',
    ])
    expect(result[0].statisticsForHeader).toEqual([
      { key: 'doe.bySector.legacy', value: 6 },
      { key: 'doe.bySector.none', value: 5 },
    ])
  })

  it('keeps a round chart populated when one requested round has no obliged companies', async () => {
    const result = await getMultipleStatistics(
      { sourceDataKeys: ['doe.roundBySector.1', 'doe.roundBySector.3'] },
      sourceData,
    )

    expect(result).toHaveLength(4)
    expect(result[0].statisticsForHeader).toEqual([
      { key: 'doe.roundBySector.1', value: 4 },
      { key: 'doe.roundBySector.3', value: 0 },
    ])
  })

  it('serves a single-value key with the as-of header', async () => {
    const result = await getMultipleStatistics(
      { sourceDataKeys: ['doe.obliged'] },
      sourceData,
    )

    expect(result).toHaveLength(1)
    expect(result[0].header).toBe(AS_OF)
    expect(result[0].statisticsForHeader).toEqual([
      { key: 'doe.obliged', value: 14 },
    ])
  })

  it('returns nothing for a withheld headcount, so it renders as no data', async () => {
    const { data } = toDirectorateOfEqualitySourceData(
      statistics({ employees: [{ status: 'VOTTUN', employees: null }] }),
    )
    const result = await getMultipleStatistics(
      { sourceDataKeys: ['doe.employees.legacy'] },
      { data: { 'doe.employees.legacy': data['employees.legacy'] } },
    )

    expect(result).toEqual([])
  })

  it('keeps both 25+ size buckets', async () => {
    const result = await getMultipleStatistics(
      { sourceDataKeys: ['doe.obligedBySize'] },
      sourceData,
    )

    expect(result.map((item) => item.header)).toEqual(['50+', '25–49'])
  })
})

import type {
  AggregateStatisticsDto,
  StatisticsCertificationStatusEnum,
  StatisticsCompanyCellDto,
  StatisticsCompanySizeEnum,
  StatisticsSectorEnum,
} from '@island.is/clients/directorate-of-equality-statistics'
import type {
  StatisticSourceData,
  StatisticSourceValue,
} from '@island.is/shared/types'

/**
 * Turns the DoE statistics cells into national chart keys for CMS Chart and
 * ChartNumberBox slices. Keys are returned without the `doe.` prefix.
 *
 * - Single-value keys carry one point whose header is `generatedAt` in ms,
 *   which ChartNumberBox shows as the as-of date.
 * - Pie charts take one slice per key, so the status donut is one key per
 *   status group.
 * - Bar series share identical headers in a fixed order, zeros included, so the
 *   chart can line them up.
 */

// Type-only imports: the generated enums are string unions, and a runtime
// import would load the client module (and X-Road config) into this mapper.
type Status = StatisticsCertificationStatusEnum

// Record keys make these exhaustive: a new status or sector fails the build.
// Every legacy certificate shares one key, "Eldra jafnlaunakerfi": DMR's
// register never recorded vottun vs staðfesting, so a split would always be 0.
const STATUS_KEY: Record<Status, string> = {
  VOTTUN: 'legacy',
  STADFESTING: 'legacy',
  UNCLASSIFIED: 'legacy',
  SKYRSLUGJOF: 'skyrslugjof',
  NONE: 'none',
}

const STATUSES = Object.keys(STATUS_KEY) as Status[]

const COVERED_STATUSES = STATUSES.filter((status) => status !== 'NONE')

const STATUS_KEYS = [...new Set(STATUSES.map((status) => STATUS_KEY[status]))]

const COVERED_KEYS = STATUS_KEYS.filter((key) => key !== STATUS_KEY.NONE)

const hasKey = (key: string) => (cell: { status: Status }) =>
  STATUS_KEY[cell.status] === key

const SECTOR_HEADER: Record<StatisticsSectorEnum, string> = {
  FYRIRTAEKI: 'Fyrirtæki',
  RIKISADILI: 'Ríkisaðilar',
  SVEITARFELAG: 'Sveitarfélög',
  UNKNOWN: 'Óflokkað',
}

const SECTORS = Object.keys(SECTOR_HEADER) as StatisticsSectorEnum[]

// Every status is salary-side, and a salary report is owed from 50 employees.
// Companies under 50 that the Directorate required anyway are not in the feed.
const OBLIGED_SIZES: StatisticsCompanySizeEnum[] = ['LARGE']

// 25+ is the equality-plan population, broken down by size.
const SIZE_HEADER: Array<[StatisticsCompanySizeEnum, string]> = [
  ['LARGE', '50+'],
  ['MEDIUM', '25–49'],
]

const UNKNOWN_ROUND_KEY = 'unknown'

const isObliged = (cell: { size: StatisticsCompanySizeEnum }) =>
  OBLIGED_SIZES.includes(cell.size)

const isCovered = (cell: StatisticsCompanyCellDto) => cell.status !== 'NONE'

const sumCompanies = <T extends { companies: number }>(
  cells: T[],
  predicate: (cell: T) => boolean = () => true,
) =>
  cells.reduce((sum, cell) => (predicate(cell) ? sum + cell.companies : sum), 0)

const bySector = <
  T extends { sector: StatisticsSectorEnum; companies: number },
>(
  cells: T[],
): StatisticSourceValue[] =>
  SECTORS.map((sector) => ({
    header: SECTOR_HEADER[sector],
    value: sumCompanies(cells, (cell) => cell.sector === sector),
  }))

export const toDirectorateOfEqualitySourceData = (
  statistics: AggregateStatisticsDto,
): StatisticSourceData => {
  const asOf = String(statistics.generatedAt.getTime())
  const single = (value: number | null): StatisticSourceValue[] => [
    { header: asOf, value },
  ]

  const obliged = statistics.companies.filter(isObliged)
  const obligedCount = sumCompanies(obliged)
  const compliedCount = sumCompanies(obliged, isCovered)

  const employeesByStatus = new Map(
    statistics.employees.map((entry) => [entry.status, entry.employees]),
  )
  // Only published figures are summed, so a total never reveals a withheld one.
  const publishedEmployees = (statuses: Status[]): number | null => {
    const values = statuses
      .map((status) => employeesByStatus.get(status) ?? null)
      .filter((value): value is number => value !== null)
    return values.length === 0
      ? null
      : values.reduce((sum, value) => sum + value, 0)
  }

  const data: Record<string, StatisticSourceValue[]> = {
    obliged: single(obligedCount),
    complied: single(compliedCount),
    compliedShare: single(
      obligedCount === 0 ? null : compliedCount / obligedCount,
    ),
    voluntary: single(
      sumCompanies(
        statistics.companies,
        (cell) => isCovered(cell) && !isObliged(cell),
      ),
    ),
    withSystem: single(sumCompanies(statistics.companies, isCovered)),
    employees: single(publishedEmployees(COVERED_STATUSES)),
    obligedBySize: SIZE_HEADER.map(([size, header]) => ({
      header,
      value: sumCompanies(statistics.companies, (cell) => cell.size === size),
    })),
  }

  for (const key of STATUS_KEYS) {
    data[`status.${key}`] = single(sumCompanies(obliged, hasKey(key)))
    data[`bySector.${key}`] = bySector(obliged.filter(hasKey(key)))
  }

  for (const key of COVERED_KEYS) {
    data[`employees.${key}`] = single(
      publishedEmployees(
        COVERED_STATUSES.filter((status) => STATUS_KEY[status] === key),
      ),
    )
  }

  const obligedRounds = statistics.rounds.filter(isObliged)
  const roundKeys = [
    ...new Set(
      obligedRounds.map((cell) =>
        cell.round === null ? UNKNOWN_ROUND_KEY : String(cell.round),
      ),
    ),
  ]
  for (const roundKey of roundKeys) {
    data[`roundBySector.${roundKey}`] = bySector(
      obligedRounds.filter(
        (cell) =>
          (cell.round === null ? UNKNOWN_ROUND_KEY : String(cell.round)) ===
          roundKey,
      ),
    )
  }

  return { data }
}

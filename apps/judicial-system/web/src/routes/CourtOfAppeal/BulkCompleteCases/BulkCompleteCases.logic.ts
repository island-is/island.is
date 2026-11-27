import { enumerate } from '@island.is/judicial-system/formatters'
import { MAX_COMPLETED_VERDICT_APPEALS } from '@island.is/judicial-system/types'
import type {
  CaseTableCell,
  CaseTableRow,
} from '@island.is/judicial-system-web/src/graphql/schema'

export type RowClickAction = 'stage' | 'unstage' | 'open'

/**
 * Identifies a row. One case can have several rows, one per appeal, so the
 * appeal case id is used when the row has one.
 */
export const getRowId = (row: CaseTableRow): string =>
  row.appealCaseId ?? row.caseId

export type StageRefusal = 'noAppealCase' | 'limitReached'

/**
 * Why a row that is not staged cannot be. Appeals are completed by their
 * appeal case id, so a row without one cannot be completed here, and no more
 * than MAX_COMPLETED_VERDICT_APPEALS can be completed at once. Undefined when
 * the row can be staged, and for a row that is already staged or is not among
 * the rows, which staging leaves alone anyway.
 */
export const getStageRefusal = (
  stagedIds: string[],
  rows: CaseTableRow[],
  rowId: string,
): StageRefusal | undefined => {
  const row = rows.find((r) => getRowId(r) === rowId)

  if (!row || stagedIds.includes(rowId)) {
    return undefined
  }

  if (!row.appealCaseId) {
    return 'noAppealCase'
  }

  if (stagedIds.length >= MAX_COMPLETED_VERDICT_APPEALS) {
    return 'limitReached'
  }

  return undefined
}

export const getStageRefusalMessage = (refusal: StageRefusal): string =>
  refusal === 'limitReached'
    ? `Hægt er að ljúka að hámarki ${MAX_COMPLETED_VERDICT_APPEALS} málum í einu.`
    : 'Ekki er hægt að ljúka þessu máli hér.'

/**
 * Adds a row to the end of the staged ids. A row that is already staged, that
 * is not among the rows, or that cannot be staged (see getStageRefusal)
 * leaves the ids as they are.
 */
export const stageCase = (
  stagedIds: string[],
  rows: CaseTableRow[],
  rowId: string,
): string[] => {
  if (stagedIds.includes(rowId)) {
    return stagedIds
  }

  if (!rows.some((r) => getRowId(r) === rowId)) {
    return stagedIds
  }

  if (getStageRefusal(stagedIds, rows, rowId)) {
    return stagedIds
  }

  return [...stagedIds, rowId]
}

/** The appeal case ids of the rows, which is what completing them takes. */
export const getAppealCaseIds = (rows: CaseTableRow[]): string[] =>
  rows.flatMap((r) => (r.appealCaseId ? [r.appealCaseId] : []))

export const unstageCase = (stagedIds: string[], rowId: string): string[] =>
  stagedIds.filter((id) => id !== rowId)

/**
 * Splits the rows into the staged ones, in the order they were staged, and
 * the remaining ones, in their original order.
 */
export const partitionRows = (
  rows: CaseTableRow[],
  stagedIds: string[],
): { staged: CaseTableRow[]; source: CaseTableRow[] } => {
  const staged = stagedIds
    .map((id) => rows.find((r) => getRowId(r) === id))
    .filter((r): r is CaseTableRow => r !== undefined)
  const source = rows.filter((r) => !stagedIds.includes(getRowId(r)))

  return { staged, source }
}

/**
 * The text a cell shows first: its string, or the first non-empty string of
 * its string group. Empty for a cell that shows no string.
 */
export const getCellText = (cell?: CaseTableCell): string => {
  const value = cell?.value

  switch (value?.__typename) {
    case 'StringValue':
      return value.str
    case 'StringGroupValue':
      return value.strList.find((s) => s !== '') ?? ''
    default:
      return ''
  }
}

/** Everything a cell shows as text, its lines joined by spaces. */
export const getCellDisplayText = (cell?: CaseTableCell): string => {
  const value = cell?.value

  switch (value?.__typename) {
    case 'StringValue':
      return value.str
    case 'StringGroupValue':
      return value.strList.filter((s) => s !== '').join(' ')
    default:
      return ''
  }
}

/** The case number a row shows first: the first string of its first cell. */
export const getRowCaseNumber = (row: CaseTableRow): string =>
  getCellText(row.cells[0])

// Icelandic numbers ending in 1, other than those ending in 11, take the
// singular.
export const formatCaseCountDative = (count: number): string =>
  count % 10 === 1 && count % 100 !== 11 ? `${count} máli` : `${count} málum`

export const formatCaseNumberList = (rows: CaseTableRow[]): string =>
  enumerate(
    rows.map(getRowCaseNumber).filter((n) => n !== ''),
    'og',
  )

/**
 * Tells rows apart for screen readers by the text of the first two cells
 * that show a string.
 */
export const getRowLabel = (row: CaseTableRow): string =>
  row.cells
    .map(getCellText)
    .filter((text) => text !== '')
    .slice(0, 2)
    .join(', ')

export const getRowActionLabel = (
  action: RowClickAction,
  label: string,
): string => {
  const caseName = label ? `mál ${label}` : 'mál'

  switch (action) {
    case 'stage':
      return `Velja ${caseName} til að ljúka`
    case 'unstage':
      return `Taka ${caseName} af lista`
    case 'open':
    default:
      return `Opna ${caseName}`
  }
}

export const getMoveAnnouncement = (
  action: 'stage' | 'unstage',
  label: string,
): string =>
  action === 'stage'
    ? `Mál ${label} valið til að ljúka`
    : `Mál ${label} tekið af lista`

// The design's widths, in pixels, of the six case columns in a table of
// 1344px that also holds a 64px menu column.
const designTableWidth = 1344
const designColumnWidths = [190, 230, 200, 230, 220, 210]

// The position of "Dómsuppkvaðning" among the six case columns.
export const RULING_DATE_COLUMN_INDEX = 3

// The ruling date cell sorts by its ISO date-time.
const isoDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/

/**
 * The ruling date and time of a row, read from the sort value of its ruling
 * date cell. Undefined when the row has no such cell or its value is not a
 * date-time.
 */
export const getRulingDate = (row: CaseTableRow): Date | undefined => {
  const sortValue = row.cells[RULING_DATE_COLUMN_INDEX]?.sortValue

  if (!sortValue || !isoDateTime.test(sortValue)) {
    return undefined
  }

  const date = new Date(sortValue)

  return Number.isNaN(date.getTime()) ? undefined : date
}

/** The rows whose ruling date and time is later than now. */
export const getRowsWithFutureRulingDate = (
  rows: CaseTableRow[],
  now: Date,
): CaseTableRow[] =>
  rows.filter((r) => {
    const rulingDate = getRulingDate(r)

    return rulingDate !== undefined && rulingDate.getTime() > now.getTime()
  })

/**
 * Names the rows whose ruling has not come, each with its date and time as
 * the row shows them. Undefined when there are none.
 */
export const getFutureRulingDateWarning = (
  rows: CaseTableRow[],
  now: Date,
): string | undefined => {
  const futureRows = getRowsWithFutureRulingDate(rows, now)

  if (futureRows.length === 0) {
    return undefined
  }

  const cases = futureRows.map((r) => {
    const caseNumber = getRowCaseNumber(r)
    const rulingDate = getCellDisplayText(r.cells[RULING_DATE_COLUMN_INDEX])

    return rulingDate ? `${caseNumber} (${rulingDate})` : caseNumber
  })

  return `Dómsuppkvaðning er ekki hafin í eftirfarandi málum: ${cases.join(
    ', ',
  )}`
}

/**
 * The width of a case column as a share of the table, in the design's
 * proportions. A table with another number of columns than the design gets
 * no widths, and its columns share the table equally.
 */
export const getColumnWidth = (
  index: number,
  columnCount: number,
): string | undefined => {
  if (columnCount !== designColumnWidths.length) {
    return undefined
  }

  const width = designColumnWidths[index]

  if (width === undefined) {
    return undefined
  }

  return `${Number(((width / designTableWidth) * 100).toFixed(2))}%`
}

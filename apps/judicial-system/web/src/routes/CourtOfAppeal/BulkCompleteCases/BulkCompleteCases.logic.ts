import { enumerate } from '@island.is/judicial-system/formatters'
import type { CaseTableRow } from '@island.is/judicial-system-web/src/graphql/schema'

export type RowClickAction = 'stage' | 'unstage' | 'open'

/**
 * Adds a case to the end of the staged ids. A case that is already staged,
 * or that is not among the rows, leaves the ids as they are.
 */
export const stageCase = (
  stagedIds: string[],
  rows: CaseTableRow[],
  caseId: string,
): string[] => {
  if (stagedIds.includes(caseId)) {
    return stagedIds
  }

  if (!rows.some((r) => r.caseId === caseId)) {
    return stagedIds
  }

  return [...stagedIds, caseId]
}

export const unstageCase = (stagedIds: string[], caseId: string): string[] =>
  stagedIds.filter((id) => id !== caseId)

/**
 * Splits the rows into the staged ones, in the order they were staged, and
 * the remaining ones, in their original order.
 */
export const partitionRows = (
  rows: CaseTableRow[],
  stagedIds: string[],
): { staged: CaseTableRow[]; source: CaseTableRow[] } => {
  const staged = stagedIds
    .map((id) => rows.find((r) => r.caseId === id))
    .filter((r): r is CaseTableRow => r !== undefined)
  const source = rows.filter((r) => !stagedIds.includes(r.caseId))

  return { staged, source }
}

/** The case number a row shows first: the first string of its first cell. */
export const getRowCaseNumber = (row: CaseTableRow): string => {
  const value = row.cells[0]?.value

  switch (value?.__typename) {
    case 'StringValue':
      return value.str
    case 'StringGroupValue':
      return value.strList.find((s) => s !== '') ?? ''
    default:
      return ''
  }
}

export const formatCaseCountDative = (count: number): string =>
  count === 1 ? '1 máli' : `${count} málum`

export const formatCaseNumberList = (rows: CaseTableRow[]): string =>
  enumerate(
    rows.map(getRowCaseNumber).filter((n) => n !== ''),
    'og',
  )

/** Tells rows apart for screen readers by their two leading cell values. */
export const getRowLabel = (row: CaseTableRow): string =>
  row.cells
    .map((c) => c.sortValue)
    .filter((v): v is string => Boolean(v))
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

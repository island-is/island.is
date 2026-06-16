import { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'

/**
 * Sort uncategorized case files for display.
 * - If ALL files have orderWithinChapter set: sort by that index.
 * - Otherwise (legacy cases): preserve backend order (created ASC) — return as-is.
 */
export const sortCaseFiles = <
  T extends Pick<CaseFile, 'orderWithinChapter' | 'created'>,
>(
  files: T[],
): T[] => {
  const allHaveOrder = files.every(
    (f) => f.orderWithinChapter !== null && f.orderWithinChapter !== undefined,
  )
  if (!allHaveOrder) {
    return files
  }
  return [...files].sort(
    (a, b) => (a.orderWithinChapter ?? 0) - (b.orderWithinChapter ?? 0),
  )
}

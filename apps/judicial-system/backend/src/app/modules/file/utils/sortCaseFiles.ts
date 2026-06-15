export type CaseFileOrderFields = {
  orderWithinChapter?: number | null
  created: Date | string
}

/**
 * Sort case files for court delivery.
 * - Legacy cases (no file has orderWithinChapter): preserve input order unchanged.
 * - Ordered cases: sort by orderWithinChapter; nulls last, then created ASC.
 */
export const sortCaseFilesByOrder = <T extends CaseFileOrderFields>(
  files: T[],
): T[] => {
  const hasOrderedFiles = files.some(
    (file) =>
      file.orderWithinChapter !== null && file.orderWithinChapter !== undefined,
  )

  if (!hasOrderedFiles) {
    return files
  }

  return [...files].sort((a, b) => {
    if (a.orderWithinChapter === null && b.orderWithinChapter === null) {
      return new Date(a.created).getTime() - new Date(b.created).getTime()
    }
    if (a.orderWithinChapter === null) {
      return 1
    }
    if (b.orderWithinChapter === null) {
      return -1
    }
    return (a.orderWithinChapter ?? 0) - (b.orderWithinChapter ?? 0)
  })
}

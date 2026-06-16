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
    const aOrder = a.orderWithinChapter
    const bOrder = b.orderWithinChapter

    if (
      (aOrder === null || aOrder === undefined) &&
      (bOrder === null || bOrder === undefined)
    ) {
      return new Date(a.created).getTime() - new Date(b.created).getTime()
    }
    if (aOrder === null || aOrder === undefined) {
      return 1
    }
    if (bOrder === null || bOrder === undefined) {
      return -1
    }
    return aOrder - bOrder
  })
}

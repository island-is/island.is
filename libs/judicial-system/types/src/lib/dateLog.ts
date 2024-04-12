export enum DateType {
  COURT_DATE = 'COURT_DATE',
}

export const getLatestDateTypeByCaseId = (
  dateType: DateType,
  caseId: string,
  dates?:
    | {
        created?: string | null
        caseId?: string | null
        dateType?: DateType | null
        date?: string | null
      }[]
    | null,
) => {
  const typeDates = dates?.filter(
    (date) => date.dateType === dateType && date.caseId === caseId,
  )

  if (!typeDates || typeDates.length === 0) {
    return undefined
  }

  return typeDates[0]
}

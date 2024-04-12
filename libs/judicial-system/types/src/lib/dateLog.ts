export enum DateType {
  COURT_DATE = 'COURT_DATE',
}

export const getLatestDateTypeByCaseId = (
  dateType: DateType,
  caseId: string,
  dates?: {
    created?: string
    caseId?: string
    dateType?: DateType
    date?: string
  }[],
) => {
  const typeDates = dates?.filter(
    (date) => date.dateType === dateType && date.caseId === caseId,
  )

  if (!typeDates || typeDates.length === 0) {
    return undefined
  }

  return typeDates[0]
}

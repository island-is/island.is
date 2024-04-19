export enum DateType {
  COURT_DATE = 'COURT_DATE',
}

export const getLatestDateType = (
  dateType: DateType,
  dates?:
    | {
        created?: string | Date | null
        caseId?: string | null
        dateType?: DateType | null
        date?: string | Date | null
      }[]
    | null,
) => {
  const typeDates = dates?.filter((date) => date.dateType === dateType)

  if (!typeDates || typeDates.length === 0) {
    return undefined
  }

  return typeDates[0]
}

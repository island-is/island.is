import max from 'date-fns/max'
export enum DateType {
  COURT_DATE = 'COURT_DATE',
  POSTPONED_COURT_DATE = 'POSTPONED_COURT_DATE',
}

/**
 * Returns the latest date of a given types.
 * If only one dateType is given, the function will return the latest date of that type.
 * If multiple dateTypes are given, the function will return the latest date of any of the given types.
 */
export const getLatestDateType = (
  dateTypes: DateType[],
  dates?:
    | {
        created?: string | Date | null
        caseId?: string | null
        dateType?: DateType | null
        date?: string | Date | null
      }[]
    | null,
) => {
  if (!dates || dates.length === 0) {
    return undefined
  }

  const typeDates = dates.filter(
    (date) =>
      date.dateType !== undefined &&
      date.dateType !== null &&
      dateTypes.includes(date.dateType),
  )

  const latestObject = typeDates.reduce((latest, current) => {
    if (current.date === null || current.date === undefined) {
      return latest
    }

    if (latest.date === null || latest.date === undefined) {
      return current
    }

    return current.date > latest.date ? current : latest
  }, {})

  return latestObject
}

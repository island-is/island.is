import { ResidenceEntryDto } from '@island.is/clients/national-registry-v3-applications'

const getDomicileOnDate = (
  data: ResidenceEntryDto[] | null,
  date: string,
): ResidenceEntryDto | null => {
  const targetDate = new Date(date)

  const result =
    data?.find((entry) => {
      const entryStartDate = entry.dateOfChange
        ? entry.dateOfChange
        : new Date('1986-01-01T00:00:00.000Z') // If the value is null, that means that the registration is from before 1986.
      return entryStartDate <= targetDate
    }) ?? null
  return result ? result : null
}

const formatBankInfo = (bankInfo: string) =>
  bankInfo.replace(/^(.{4})(.{2})/, '$1-$2-')

interface PreemptiveErrorData {
  status: number
  body: {
    detail: string
  }
}

const getPreemptiveErrorDetails = (error: PreemptiveErrorData) => {
  if (error.status === 406) {
    return error.body?.detail
  }
}

export { getDomicileOnDate, formatBankInfo, getPreemptiveErrorDetails }

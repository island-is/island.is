import { ResidenceHistoryEntryDto } from '@island.is/clients/national-registry-v2'

const getDomicileAtPostalCodeOnDate = (
  data: ResidenceHistoryEntryDto[],
  targetPostalCode: string,
  date: string,
): ResidenceHistoryEntryDto | undefined => {
  const targetDate = new Date(date)

  return data.find((entry) => {
    const entryStartDate = entry.dateOfChange
    return (
      entry.postalCode === targetPostalCode &&
      entryStartDate &&
      entryStartDate <= targetDate
    )
  })
}

const getDomicileOnDate = (
  data: ResidenceHistoryEntryDto[],
  date: string,
): ResidenceHistoryEntryDto | undefined => {
  const targetDate = new Date(date)

  return data.find((entry) => {
    const entryStartDate = entry.dateOfChange
    return entryStartDate && entryStartDate <= targetDate
  })
}

const formatBankInfo = (bankInfo: string) =>
  bankInfo.replace(/^(.{4})(.{2})/, '$1-$2-')

export { getDomicileOnDate, getDomicileAtPostalCodeOnDate, formatBankInfo }

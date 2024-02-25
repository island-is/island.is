import { ResidenceHistoryEntryDto } from '@island.is/clients/national-registry-v2'

export default function getDomicileAtPostalCodeOnDate(
  data: ResidenceHistoryEntryDto[],
  targetPostalCode: string,
  date: string,
): ResidenceHistoryEntryDto | undefined {
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

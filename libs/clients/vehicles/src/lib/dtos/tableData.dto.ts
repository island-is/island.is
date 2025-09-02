import { CurrentVehiclesWithMilageAndNextInspDtoListPagedResponse } from '../..'
import format from 'date-fns/format'

export const mapVehicleDataToNestedArray = (
  data?: CurrentVehiclesWithMilageAndNextInspDtoListPagedResponse,
): unknown[][] | null => {
  if (
    !data ||
    !data.pageNumber ||
    !data.pageSize ||
    !data.totalPages ||
    !data.totalRecords
  ) {
    return null
  }

  const indexes = {
    bilnumer: 0,
    'seinasta skraning': 1,
    'seinasta skrada stada': 2,
    kilometrastada: 3,
  }

  const header = Object.keys(indexes)
  const rows: Array<Array<unknown>> = []

  data.data?.forEach(({ permno, latestMileageReadDate, latestMileage }) => {
    const dataRow = [
      permno,
      latestMileageReadDate
        ? format(latestMileageReadDate, 'dd.MM.yyyy - HH:mm')
        : '',
      latestMileage ?? 0,
      undefined,
    ]
    rows.push(dataRow)
  })

  return [header, ...rows]
}

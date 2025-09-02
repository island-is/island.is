import { CurrentVehiclesWithMilageAndNextInspDtoListPagedResponse } from "../.."
import format from 'date-fns/format'

export const mapVehicleDataToNestedArray = (data?: CurrentVehiclesWithMilageAndNextInspDtoListPagedResponse): unknown[][] | null => {
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

 data.data?.forEach((vehicle) => {
   rows[indexes.bilnumer].push(vehicle.permno)
   rows[indexes["seinasta skraning"]].push(
     vehicle.latestMileageReadDate
       ? format(vehicle.latestMileageReadDate, 'dd.MM.yyyy - HH:mm')
       : '',
   )
   rows[indexes["seinasta skrada stada"]].push(
     vehicle.latestMileage ?? 0,
   )
   rows[indexes['kilometrastada']].push(undefined)
  })

  return [header, ...rows]
}

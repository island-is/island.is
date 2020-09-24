import CSVStringify from 'csv-stringify'

import { Airlines } from '@island.is/air-discount-scheme/consts'
import { FlightLeg } from '@island.is/air-discount-scheme-web/graphql/schema'

import { FilterInput, financialStateOptions } from './consts'

export const downloadCSV = (flightLegs: FlightLeg[], filters: FilterInput) => {
  Object.keys(Airlines)
    .filter(
      (airline) =>
        !filters.airline?.value || filters.airline?.value === airline,
    )
    .forEach((airline) => {
      const header = [
        'Flug',
        'Dagsetning',
        'Staða',
        'Upphafsverð',
        'Afsláttarverð',
        'Afsláttur',
        'FlugID',
        'FlugLeggjaID',
      ]
      const data = getFilteredFlightLegs(
        airline === Airlines.norlandair ? Airlines.icelandair : airline,
        filters.airline?.value,
        flightLegs,
      ).map((flightLeg) => [
        flightLeg.travel,
        flightLeg.flight.bookingDate,
        (
          financialStateOptions.find(
            (state) => state.value === flightLeg.financialState,
          ) || { label: '-' }
        ).label,
        flightLeg.originalPrice,
        flightLeg.discountPrice,
        flightLeg.originalPrice - flightLeg.discountPrice,
        flightLeg.flight.id,
        flightLeg.id,
      ])
      data.unshift(header)

      CSVStringify(data, (err, output) => {
        const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${output}`)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `loftbru_${airline}_yfirlit.csv`)
        document.body.appendChild(link)

        link.click()
      })
    })
}

export const getFilteredFlightLegs = (
  airline: string,
  filteredAirline: string,
  flightLegs: FlightLeg[],
): FlightLeg[] => {
  if (filteredAirline === Airlines.norlandair) {
    return flightLegs.filter(
      (flightLeg) =>
        flightLeg.airline === airline &&
        flightLeg.cooperation === filteredAirline,
    )
  }
  return flightLegs.filter(
    (flightLeg) =>
      flightLeg.airline === airline || flightLeg.cooperation === airline,
  )
}

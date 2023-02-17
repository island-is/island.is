import CSVStringify from 'csv-stringify'

import { Airlines } from '@island.is/air-discount-scheme/consts'

import { financialStateOptions } from './consts'
import { FlightLeg } from './types'
import type { FlightLegsFilters } from './Overview.loader'

const getAirlinesAvailableForCSVDownload = (filters: FlightLegsFilters) =>
  Object.keys(Airlines).filter(
    (airline) => !filters.airline || filters.airline === airline,
  )

export const downloadCSV = (
  flightLegs: FlightLeg[],
  filters: FlightLegsFilters,
) => {
  getAirlinesAvailableForCSVDownload(filters).forEach((airline) => {
    const header = [
      'Flug',
      'Dagsetning',
      'Staða',
      'Upphafsverð',
      'Afsláttarverð',
      'Afsláttur',
      'FlugID',
      'FlugLeggjaID',
      'Kyn',
      'Aldur',
      'Póstnúmer',
    ]
    const data = getFilteredFlightLegs(airline, flightLegs).map((flightLeg) => [
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
      flightLeg.flight.userInfo.gender,
      flightLeg.flight.userInfo.age,
      flightLeg.flight.userInfo.postalCode,
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
  flightLegs: FlightLeg[],
): FlightLeg[] => {
  return flightLegs.filter((flightLeg) => flightLeg.airline === airline)
}

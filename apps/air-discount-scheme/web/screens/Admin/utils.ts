import CSVStringify from 'csv-stringify'

import { Airlines } from '@island.is/air-discount-scheme/consts'
import { FlightLeg } from '@island.is/air-discount-scheme-web/graphql/schema'

import { FilterInput, financialStateOptions } from './consts'

const getAirlinesAvailableForCSVDownload = (filters: FilterInput) =>
  Object.keys(Airlines).filter(
    (airline) => !filters.airline?.value || filters.airline?.value === airline,
  )

export const isCSVAvailable = (filters: FilterInput) =>
  getAirlinesAvailableForCSVDownload(filters).length > 0

export const downloadCSV = (flightLegs: FlightLeg[], filters: FilterInput) => {
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

import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  name: { id: 'web.taxiStationList:name', defaultMessage: 'Nafn' },
  driverCount: {
    id: 'web.taxiStationList:driverCount',
    defaultMessage: 'Fjöldi bílstjóra',
  },
  searchPlaceholder: {
    id: 'web.taxiStationList:searchPlaceholder',
    defaultMessage: 'Leita að leigubílastöð',
  },
  noStationsFound: {
    id: 'web.taxiStationList:noStationsFound',
    defaultMessage: 'Engar leigubílastöðvar fundust',
  },
  errorTitle: {
    id: 'web.taxiStationList:errorTitle',
    defaultMessage: 'Villa kom upp',
  },
  errorMessage: {
    id: 'web.taxiStationList:errorMessage',
    defaultMessage: 'Ekki tókst að sækja lista yfir leigubílastöðvar',
  },
})

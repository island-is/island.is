import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  name: { id: 'web.taxiOperatingLicenceList:name', defaultMessage: 'Nafn' },
  stationId: {
    id: 'web.taxiOperatingLicenceList:stationId',
    defaultMessage: 'Stöðvarnúmer',
  },
  stationName: {
    id: 'web.taxiOperatingLicenceList:stationName',
    defaultMessage: 'Stöð',
  },
  representativeName: {
    id: 'web.taxiOperatingLicenceList:representativeName',
    defaultMessage: 'Forráðamaður ef lögaðili',
  },
  searchPlaceholder: {
    id: 'web.taxiOperatingLicenceList:searchPlaceholder',
    defaultMessage: 'Leita að leigubílstjóra',
  },
  noDriversFound: {
    id: 'web.taxiOperatingLicenceList:noDriversFound',
    defaultMessage: 'Engir leigubílstjórar fundust',
  },
  errorTitle: {
    id: 'web.taxiOperatingLicenceList:errorTitle',
    defaultMessage: 'Villa kom upp',
  },
  errorMessage: {
    id: 'web.taxiOperatingLicenceList:errorMessage',
    defaultMessage: 'Ekki tókst að sækja lista yfir leigubílstjóra',
  },
})

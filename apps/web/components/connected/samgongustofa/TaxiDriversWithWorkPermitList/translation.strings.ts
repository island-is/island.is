import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  name: { id: 'web.taxiWorkPermitList:name', defaultMessage: 'Nafn' },
  searchPlaceholder: {
    id: 'web.taxiWorkPermitList:searchPlaceholder',
    defaultMessage: 'Leita að leigubílstjóra',
  },
  noDriversFound: {
    id: 'web.taxiWorkPermitList:noDriversFound',
    defaultMessage: 'Engir leigubílstjórar fundust',
  },
  errorTitle: {
    id: 'web.taxiWorkPermitList:errorTitle',
    defaultMessage: 'Villa kom upp',
  },
  errorMessage: {
    id: 'web.taxiWorkPermitList:errorMessage',
    defaultMessage: 'Ekki tókst að sækja lista yfir leigubílstjóra',
  },
})

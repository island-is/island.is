import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  searchPlaceholder: {
    id: 'web.drivingInstructorList:searchPlaceholder',
    defaultMessage: 'Leita',
    description: 'Titill á placeholder í leitarglugga',
  },
  errorOccurredTitle: {
    id: 'web.drivingInstructorList:errorOccurredTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Titill á villu skilaboðum',
  },
  errorOccurredMessage: {
    id: 'web.drivingInstructorList:errorOccurredMessage',
    defaultMessage: 'Ekki tókst að sækja ökukennara',
    description: 'Texti fyrir villu skilaboð',
  },
  noResultsFound: {
    id: 'web.drivingInstructorList:noResultsFound',
    defaultMessage: 'Engir ökukennarar fundust',
    description: 'Texti þegar engir ökukennarar finnast',
  },
  name: {
    id: 'web.drivingInstructorList:name',
    defaultMessage: 'Nafn',
    description: 'Texti fyrir nafn í töflu haus',
  },
  nationalId: {
    id: 'web.drivingInstructorList:nationalId',
    defaultMessage: 'Kennitala',
    description: 'Texti fyrir kennitölu í töflu haus',
  },
  driverLicenseId: {
    id: 'web.drivingInstructorList:driverLicenseId',
    defaultMessage: 'Ökuréttindisnúmer',
    description: 'Texti fyrir ökuréttindisnúmer í töflu haus',
  },
})

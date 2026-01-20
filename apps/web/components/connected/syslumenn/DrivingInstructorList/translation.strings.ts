import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  searchPlaceholder: {
    id: 'web.syslumenn.drivingInstructorList:searchPlaceholder',
    defaultMessage: 'Leita',
    description: 'Titill á placeholder í leitarglugga',
  },
  errorOccurredTitle: {
    id: 'web.syslumenn.drivingInstructorList:errorOccurredTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Titill á villu skilaboðum',
  },
  errorOccurredMessage: {
    id: 'web.syslumenn.drivingInstructorList:errorOccurredMessage',
    defaultMessage: 'Ekki tókst að sækja lista yfir ökukennara',
    description: 'Texti fyrir villu skilaboð',
  },
  noResultsFound: {
    id: 'web.syslumenn.drivingInstructorList:noResultsFound',
    defaultMessage: 'Engir ökukennarar fundust',
    description: 'Texti þegar engir ökukennarar finnast',
  },
  name: {
    id: 'web.syslumenn.drivingInstructorList:name',
    defaultMessage: 'Nafn',
    description: 'Texti fyrir nafn í töflu haus',
  },
  postalCode: {
    id: 'web.syslumenn.drivingInstructorList:postalCode',
    defaultMessage: 'Póstnúmer',
    description: 'Texti fyrir póstnúmer í töflu haus',
  },
  municipality: {
    id: 'web.syslumenn.drivingInstructorList:municipality',
    defaultMessage: 'Sveitarfélag',
    description: 'Texti fyrir sveitarfélag í töflu haus',
  },
})

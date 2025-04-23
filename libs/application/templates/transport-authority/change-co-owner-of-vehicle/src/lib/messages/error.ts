import { defineMessages } from 'react-intl'

export const error = defineMessages({
  requiredValidVehicle: {
    id: 'ta.ccov.application:error.requiredValidVehicle',
    defaultMessage: 'Ökutæki þarf að vera gilt',
    description: 'Error message if the vehicle chosen is invalid or not chosen',
  },
  nameByNationalId: {
    id: 'ta.ccov.application:error.nameByNationalId',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description:
      'Error message if there was no name associated with given national id',
  },
  minAgeNotFulfilled: {
    id: 'ta.ccov.application:error.minAgeNotFulfilled',
    defaultMessage:
      'Lágmarksaldur til að mega vera meðeigandi ökutækis er 18 ára',
    description: 'Min age not fulfilled error',
  },
  submitApplicationError: {
    id: 'ta.ccov.application:error.submitApplicationError',
    defaultMessage: 'Villa kom upp við að skila inn umsókn',
    description: 'Failed to submit application',
  },
  invalidMileage: {
    id: 'ta.ccov.application:error.invalidMileage',
    defaultMessage:
      'Km skráning þarf að vera sama eða hærri en síðasta skráning',
    description: 'Invalid mileage error',
  },
})

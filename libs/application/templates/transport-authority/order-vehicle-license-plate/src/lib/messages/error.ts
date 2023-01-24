import { defineMessages } from 'react-intl'

export const error = defineMessages({
  requiredValidVehicle: {
    id: 'ta.ovlp.application:error.requiredValidVehicle',
    defaultMessage: 'Ökutæki þarf að vera gilt',
    description: 'Error message if the vehicle chosen is invalid or not chosen',
  },
  errorDataProvider: {
    id: 'ta.ovlp.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
})

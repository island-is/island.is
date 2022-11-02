import { defineMessages } from 'react-intl'

export const error = defineMessages({
  nameByNationalId: {
    id: 'ta.tvo.application:error.nameByNationalId',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description:
      'Error message if there was no name associated with given national id',
  },
  requiredValidVehicle: {
    id: 'ta.tvo.application:error.requiredValidVehicle',
    defaultMessage: 'Ökutæki þarf að vera gilt',
    description: 'Error message if the vehicle chosen is invalid or not chosen',
  },
  errorDataProvider: {
    id: 'cr.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
})

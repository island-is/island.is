import { defineMessages } from 'react-intl'

export const error = defineMessages({
  requiredValidVehicle: {
    id: 'ta.cov.application:error.requiredValidVehicle',
    defaultMessage: 'Ökutæki þarf að vera gilt',
    description: 'Error message if the vehicle chosen is invalid or not chosen',
  },
  nameByNationalId: {
    id: 'ta.cov.application:error.nameByNationalId',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description:
      'Error message if there was no name associated with given national id',
  },
  duplicateNationalId: {
    id: 'ta.cov.application:error.duplicateNationalId',
    defaultMessage: 'Þessi kennitala hefur nú þegar verið valin',
    description:
      'Error message if we enter a national id that is already in the list',
  },
})

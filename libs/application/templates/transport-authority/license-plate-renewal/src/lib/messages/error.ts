import { defineMessages } from 'react-intl'

export const error = defineMessages({
  requiredValidPlate: {
    id: 'ta.lpr.application:error.requiredValidPlate',
    defaultMessage: 'Einkamerki þarf að vera gilt',
    description: 'Error message if the plate chosen is invalid or not chosen',
  },
  errorDataProvider: {
    id: 'ta.lpr.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  validationAlertTitle: {
    id: 'ta.lpr.application:error.validationAlertTitle',
    defaultMessage: 'Það kom upp villa',
    description: 'Application check validation alert title',
  },
  plateOwnershipEmptyList: {
    id: 'ta.lpr.application:error.plateOwnershipEmptyList',
    defaultMessage: 'Þú átt engin einkamerki',
    description: 'You do not own any private license plates',
  },
})

import { defineMessages } from 'react-intl'

export const error = defineMessages({
  requiredValidVehicle: {
    id: 'ta.ovrc.application:error.requiredValidVehicle',
    defaultMessage: 'Ökutæki þarf að vera gilt',
    description: 'Error message if the vehicle chosen is invalid or not chosen',
  },
  incompleteSendToAddressTitle: {
    id: 'ta.ovrc.application:error.incompleteSendToAddressTitle',
    defaultMessage: 'Heimilisfang viðtakanda er ófullnægjandi',
    description: 'Title of error when the send to address is incomplete',
  },
  incompleteSendToAddressSummary: {
    id: 'ta.ovrc.application:error.incompleteSendToAddressSummary',
    defaultMessage:
      'Ekki tókst að panta skráningarskírteini þar sem upplýsingar vantar um heimilisfang viðtakanda.',
    description: 'Summary of error when the send to address is incomplete',
  },
  errorDataProvider: {
    id: 'ta.ovrc.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
})

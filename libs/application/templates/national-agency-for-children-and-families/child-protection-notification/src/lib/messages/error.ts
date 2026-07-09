import { defineMessages } from 'react-intl'

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'cpn.application:error.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  required: {
    id: 'cpn.application:error.required',
    defaultMessage: 'Þennan reit þarf að fylla út.',
    description: 'This field is required.',
  },
  invalidNationalId: {
    id: 'cpn.application:error.invalidNationalId',
    defaultMessage: 'Kennitalan er ekki gild.',
    description: 'The national ID is not valid.',
  },
})

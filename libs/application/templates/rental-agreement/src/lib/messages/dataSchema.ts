import { defineMessages } from 'react-intl'

export const dataSchema = defineMessages({
  nationalId: {
    id: 'ra.application:dataSchema.national.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'Error message when the kennitala is invalid.',
  },
  phoneNumber: {
    id: 'ra.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
})

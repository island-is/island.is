import { defineMessages } from 'react-intl'

export const dataSchema = defineMessages({
  nationalId: {
    id: 'ra.application:dataSchema.national.id',
    defaultMessage: 'Kennitala er ekki á réttu formi',
    description: 'Error message when nationalid is wrong',
  },
  phoneNumber: {
    id: 'ra.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
})

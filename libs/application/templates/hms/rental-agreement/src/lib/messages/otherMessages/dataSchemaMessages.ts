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

  // Debug error messages
  requiredErrorMsg: {
    id: 'ra.application:error.required',
    defaultMessage: 'Reitur má ekki vera tómur',
    description: 'Error message when a required field has not been filled',
  },
  negativeNumberError: {
    id: 'ra.application:error.negativeNumber',
    defaultMessage: 'Ekki er leyfilegt að setja inn neikvæðar tölur',
    description: 'Error message when a required field has not been filled',
  },
})

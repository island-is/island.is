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

  errorFieldCannotBeEmpty: {
    id: 'ra.application:dataSchema.errorFieldCannotBeEmpty',
    defaultMessage: 'Reitur má ekki vera tómur',
    description: 'Error message when field is empty',
  },
  errorHousingFundLength: {
    id: 'ra.application:dataSchema.errorHousingFundLength',
    defaultMessage: 'Upphæð hússjóðs má ekki vera meira en 7 tölustafir',
    description: 'Error message when housing fund amount is too long',
  },
  errorMeterNumberRegex: {
    id: 'ra.application:dataSchema.errorMeterNumberRegex',
    defaultMessage: 'Sláðu inn númer í tölustöfum',
    description: 'Error message when meter number is not valid',
  },
  errorMeterStatusRegex: {
    id: 'ra.application:dataSchema.errorMeterStatusRegex',
    defaultMessage: 'Sláðu inn stöðu í tölustöfum með mest einum aukastaf',
    description: 'Error message when meter status is not valid',
  },
})

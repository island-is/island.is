import { defineMessages } from 'react-intl'

// Error messages in the application
export const error = {
  validation: defineMessages({
    dataGathering: {
      id: 'jca.application:error.dataGathering',
      defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
      description: 'Error message when data gathering is not approved',
    },
    selectChild: {
      id: 'jca.application:error.selectChild',
      defaultMessage: 'Velja þarf að lágmarki eitt barn',
      description: 'Error message no child is selected',
    },
    invalidEmail: {
      id: 'jca.application:error.invalidEmail',
      defaultMessage: 'Netfang þarf að vera löglegt, t.d. netfang@netfang.is',
      description: 'Error message when email is invalid',
    },
    invalidPhoneNumber: {
      id: 'jca.application:error.invalidPhoneNumber',
      defaultMessage: 'Símanúmer þarf að vera 7 tölustafir',
      description: 'Error message when phone number is invalid',
    },
    counterParty: {
      id: 'jca.application:error.counterParty',
      defaultMessage: 'Fylla þarf út netfang eða símanúmer',
      description:
        'Error message when neither email or phonenumber are filled in for counter party',
    },
    durationType: {
      id: 'jca.application:error.durationType',
      defaultMessage: 'Velja þarf valmöguleika',
      description: 'Error message when durationType option is not selected',
    },
    durationDate: {
      id: 'jca.application:error.durationDate',
      defaultMessage: 'Velja þarf dagsetningu',
      description:
        'Error message when durationType is temporary and no date is selected',
    },
  }),
}

import { defineMessages } from 'react-intl'

// Error messages in the application
export const error = {
  validation: defineMessages({
    dataGathering: {
      id: 'crc.application:error.dataGathering',
      defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
      description: 'Error message when data gathering is not approved',
    },
    selectChild: {
      id: 'crc.application:error.selectChild',
      defaultMessage: 'Velja þarf að lágmarki eitt barn',
      description: 'Error message no child is selected',
    },
    invalidEmail: {
      id: 'crc.application:error.invalidEmail',
      defaultMessage: 'Netfang þarf að vera löglegt, t.d. netfang@netfang.is',
      description: 'Error message when email is invalid',
    },
    invalidPhoneNumber: {
      id: 'crc.application:error.invalidPhoneNumber',
      defaultMessage: 'Símanúmer þarf að vera gilt íslenskt númer',
      description: 'Error message when phone number is invalid',
    },
    approveChildrenResidenceChange: {
      id: 'crc.application:error.approveChildrenResidenceChange',
      defaultMessage: 'Samþykkja þarf breytingu',
      description: 'Error message when residence change is not approved',
    },
    approveTerms: {
      id: 'crc.application:error.approveTerms',
      defaultMessage: 'Samþykkja þarf alla skilmála',
      description: 'Error message when terms are not approved',
    },
    durationType: {
      id: 'crc.application:error.durationType',
      defaultMessage: 'Velja þarf valmöguleika',
      description: 'Error message when durationType option is not selected',
    },
    durationDate: {
      id: 'crc.application:error.durationDate',
      defaultMessage: 'Velja þarf dagsetningu',
      description:
        'Error message when durationType is temporary and no date is selected',
    },
    childSupportPayment: {
      id: 'crc.application:error.childSupportPayment',
      defaultMessage: 'Velja þarf valmöguleika',
      description:
        'Error message when child support payment option is not selected',
    },
    counterParty: {
      id: 'crc.application:error.counterParty',
      defaultMessage: 'Fylla þarf út netfang eða símanúmer',
      description:
        'Error message when neither email or phonenumber are filled in for counter party',
    },
    acceptContract: {
      id: 'crc.application:error.acceptContract',
      defaultMessage: 'Velja þarf valmöguleika',
      description:
        'Error message when no option is selected for accepting contract',
    },
  }),
}

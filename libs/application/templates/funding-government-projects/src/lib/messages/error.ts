import { defineMessages } from 'react-intl'

export const error = {
  general: defineMessages({
    nameError: {
      id: `affgp.application:error.contactName`,
      defaultMessage: 'Fylla þarf út nafn',
      description: 'Error message when name is empty',
    },
    invalidPhoneNumber: {
      id: `affgp.application:error.contactPhoneNumber`,
      defaultMessage: 'Símanúmer þarf að vera 7 tölustafir',
      description: 'Error message when phone number is invalid',
    },
    invalidEmail: {
      id: `affgp.application:error.contactEmail`,
      defaultMessage: 'Netfang þarf að vera löglegt, t.d. netfang@netfang.is',
      description: 'Error message when email is invalid',
    },
  }),
  labels: defineMessages({}),
}

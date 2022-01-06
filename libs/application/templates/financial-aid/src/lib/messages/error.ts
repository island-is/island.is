import { defineMessages } from 'react-intl'

// Error messages in the application
export const error = {
  validation: defineMessages({
    dataGathering: {
      id: 'fa.application:error.dataGathering',
      defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
      description: 'Error message when data gathering is not approved',
    },
  }),
}

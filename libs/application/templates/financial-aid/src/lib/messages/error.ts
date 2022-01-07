import { defineMessages } from 'react-intl'

// Error messages in the application
export const error = {
  validation: defineMessages({
    dataGathering: {
      id: 'fa.application:error.dataGathering',
      defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
      description: 'Error message when data gathering is not approved',
    },
    email: {
      id: 'fa.application:error.email',
      defaultMessage: 'Athugaðu hvort netfang sé rétt slegið inn',
      description: 'Error message when email is invalid or not present',
    },
    approveSpouse: {
      id: 'fa.application:error.approveSpouse',
      defaultMessage: 'Þú þarft að samþykkja',
      description:
        'Error message when applicant has not checked that spouse has to send files for the application to be processed',
    },
  }),
}

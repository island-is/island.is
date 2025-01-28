import { defineMessages } from 'react-intl'

export const error = {
  validation: defineMessages({
    dataGathering: {
      id: 'fa.application:error.dataGathering',
      defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
      description: 'Error message when data gathering is not approved',
    },
    radioErrorMessage: {
      id: 'fa.application:section.radioErrorMessage',
      defaultMessage: 'Þú þarft að velja einn valmöguleika',
      description: 'Error message when no option is selected',
    },
    inputErrorMessage: {
      id: 'fa.application:section.inputErrorMessage',
      defaultMessage: 'Þú þarft að skrifa í textareitinn',
      description: 'Error message when input is empty',
    },
    email: {
      id: 'fa.application:error.email',
      defaultMessage: 'Athugaðu hvort netfang sé rétt slegið inn',
      description: 'Error message when email is invalid or not present',
    },
    phone: {
      id: 'fa.application:error.phone',
      defaultMessage: 'Athugaðu hvort símanúmer sé rétt slegið inn',
      description: 'Error message when phone is invalid or not present',
    },
    nationalId: {
      id: 'fa.application:error.nationalId',
      defaultMessage: 'Athugaðu hvort kennitala sé rétt slegin inn',
      description: 'Error message when national id is invalid or not present',
    },
    approveSpouse: {
      id: 'fa.application:error.approveSpouse',
      defaultMessage: 'Þú þarft að samþykkja',
      description:
        'Error message when applicant has not checked that spouse has to send files for the application to be processed',
    },
  }),
}

import { defineMessages } from 'react-intl'

// Error messages in the application
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
      description: 'When radio is not selected',
    },
    inputErrorMessage: {
      id: 'fa.application:section.inputErrorMessage',
      defaultMessage: 'Þú þarft að skrifa í textareitinn',
      description: 'When input is empty',
    },
  }),
}

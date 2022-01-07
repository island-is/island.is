import { defineMessages } from 'react-intl'

// Global string for the application
export const application = defineMessages({
  name: {
    id: 'fa.application:application.name',
    defaultMessage: 'Fjárhagsaðstoð',
    description: 'name of financial aid application',
  },
})

// All sections in the application
export const section = defineMessages({
  dataGathering: {
    id: 'fa.application:section.dataGathering',
    defaultMessage: 'Gagnaöflun',
    description: 'Data gathering section',
  },
})

// All error message forms in the application
export const errorMessage = defineMessages({
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
})

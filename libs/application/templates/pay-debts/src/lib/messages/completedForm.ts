import { defineMessages } from 'react-intl'

export const completedForm = defineMessages({
  sectionTitle: {
    id: 'pd.application:completedForm.sectionTitle',
    defaultMessage: 'Staðfesting',
    description: 'Title of the completed form section',
  },
  alertTitle: {
    id: 'pd.application:completedForm.alertTitle',
    defaultMessage: 'Staðfesting',
    description: 'Title of the alert message in the completed form',
  },
  alertMessage: {
    id: 'pd.application:completedForm.alertMessage',
    defaultMessage: 'Greiðsla til Fjársýslunnar hefur verið móttekin!',
    description: 'Message of the alert message in the completed form',
  },
  nextStepsIntro: {
    id: 'pd.application:completedForm.nextStepsIntro#markdown',
    defaultMessage: 'Greiðslunni verður ráðstafað inn á valdar skuldir.',
    description: 'Intro of the "what happens next" section',
  },
  nextStepsDescription: {
    id: 'pd.application:completedForm.nextStepsDescription#markdown',
    defaultMessage:
      '* Í framhaldinu verður greiðslukvittun send í pósthólfið þitt.\n* Greiðslukvittun er einnig að finna undir Fjármál.',
    description: 'Description of the "what happens next" section',
  },
  financeButtonMessage: {
    id: 'pd.application:completedForm.financeButtonMessage',
    defaultMessage: 'Á síðum Fjármála getur þú nú séð uppfærða stöðu',
    description: 'Message above the button that opens Fjármál',
  },
  financeButtonLabel: {
    id: 'pd.application:completedForm.financeButtonLabel',
    defaultMessage: 'Opna Fjármál',
    description: 'Label of the button that opens Fjármál',
  },
})

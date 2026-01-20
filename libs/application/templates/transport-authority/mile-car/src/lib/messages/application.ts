import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'mcar.application:name',
    defaultMessage: 'Skráning á mílubíl',
    description: `Application's name`,
  },
  institutionName: {
    id: 'mcar.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'mcar.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'mcar.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in draft',
  },
  actionCardSubmitted: {
    id: 'mcar.application:actionCardSubmitted',
    defaultMessage: 'Innsend',
    description:
      'Description of application state/status when application is submitted',
  },
  firstSectionStepperTitle: {
    id: 'mcar.application:firstSectionStepperTitle',
    defaultMessage: 'Áður en haldið er áfram',
    description: 'Title of first section stepper',
  },
  firstSectionTitle: {
    id: 'mcar.application:firstSectionTitle',
    defaultMessage: 'Áður en haldið er áfram',
    description: 'Title of first section page',
  },
  firstSectionDescription: {
    id: 'mcar.application:firstSectionDescription#markdown',
    defaultMessage: `*Til athugunar!* 
      \n Ef þú ert á nýlegum bíl þá er líklegt að hægt sé að breyta stillingunum í bílnum þannig að hann sýni kílómetra í stað mílna. Við ráðleggjum þér að athuga það í stillingum bílsins eða hafa samband við umboðið. Sé þetta möguleiki í þinni bifreið þá er þessi skráning óþörf.`,
    description: 'Description of first section page',
  },
})

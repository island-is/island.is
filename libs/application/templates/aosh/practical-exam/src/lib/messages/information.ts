import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.pe.application:information.general.pageTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: `Information page title`,
    },
    pageDescription: {
      id: 'aosh.pe.application:information.general.pageDescription',
      defaultMessage: 'Upplýsingar um skráningaraðila',
      description: `Information page description`,
    },
    sectionTitle: {
      id: 'aosh.pe.application:information.general.sectionTitle',
      defaultMessage: 'Skráningaraðili',
      description: `Information section title`,
    },
    descriptionField: {
      id: 'aosh.pe.application:information.general.descriptionField',
      defaultMessage:
        'Vinsamlegast tilgreindu hvort þú sért að skrá sjálfan þig eða fleiri einstaklinga',
      description: `h5 description field above radio field`,
    },
    registerSelf: {
      id: 'aosh.pe.application:information.general.registerSelf',
      defaultMessage: 'Skrá bara mig',
      description: `radio label for registering self`,
    },
    registerOthers: {
      id: 'aosh.pe.application:information.general.registerOthers',
      defaultMessage: 'Skrá fleiri',
      description: `radio label for registering others`,
    },
    countryLabel: {
      id: 'aosh.pe.application:information.general.countryLabel',
      defaultMessage: 'Útgáfuland',
      description: `Label for country of issue input`,
    },
    licenseNumberLabel: {
      id: 'aosh.pe.application:information.general.licenseNumberLabel',
      defaultMessage: 'Ökuskirteinisnúmer',
      description: `Label for licence number input`,
    },
  }),
}

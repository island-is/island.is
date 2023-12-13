import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const socialInsuranceAdministrationMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'sia.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Social Insurance Administration',
    },
    formTitle: {
      id: 'sia.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'sia.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'sia.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    alertTitle: {
      id: 'sia.application:alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
  }),

  pre: defineMessages({
    externalDataSection: {
      id: 'sia.application:externalData.section',
      defaultMessage: 'Gagnaöflun --',
      description: 'Data collection',
    },
    externalDataDescription: {
      id: 'sia.application:externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt --',
      description: 'The following information will be retrieved electronically',
    },
    checkboxProvider: {
      id: 'sia.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu --',
      description:
        'I understand that the above information will be collected during the application process',
    },
    skraInformationTitle: {
      id: 'sia.application:prerequisites.national.registry.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá --',
      description: 'Information from Registers Iceland',
    },
    startApplication: {
      id: 'sia.application:prerequisites.start.application',
      defaultMessage: 'Hefja umsókn --',
      description: 'Start application',
    },
  }),
}

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'sia.application:error.phonenumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  bank: {
    id: 'sia.application:error.bank',
    defaultMessage: 'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
    description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
  },
  period: {
    id: 'sia.application:error.period',
    defaultMessage: 'Ógildur mánuður.',
    description: 'Invalid month.',
  },
  noEmailFound: {
    id: 'sia.application:error.no.email.found.title',
    defaultMessage: 'Ekkert netfang skráð',
    description: 'english translation',
  },
  noEmailFoundDescription: {
    id: 'sia.application:error.no.email.found.description#markdown',
    defaultMessage:
      'Þú ert ekki með skráð netfang hjá Tryggingastofnun. Vinsamlegast skráðu það [hér](https://minarsidur.tr.is/min-sida) og komdu svo aftur til að sækja um.',
    description: 'english translation',
  },
  iban: {
    id: 'sia.application:error.iban',
    defaultMessage: 'Ógilt IBAN',
    description: 'Invalid IBAN',
  },
  swift: {
    id: 'sia.application:error.swift',
    defaultMessage: 'Ógilt SWIFT',
    description: 'Invalid SWIFT',
  },
})

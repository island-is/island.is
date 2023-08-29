import { defineMessages } from 'react-intl'

// Confirm Contact info
export const contactInfo = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.backgroundInformation.contactInfo.sectionTitle',
      defaultMessage: 'Tengiliða upplýsingar',
      description: 'Contact info section title',
    },
    pageTitle: {
      id: 'crc.application:section.backgroundInformation.contactInfo.pageTitle',
      defaultMessage: 'Tengiliða upplýsingar',
      description: 'Contact info page title',
    },
    description: {
      id: 'crc.application:section.backgroundInformation.contactInfo.description#markdown',
      defaultMessage:
        'Sláðu inn tengiliðaupplýsingar þínar og hins foreldrisins svo öll samskipti um umsóknina milli ykkar og sýslumanns gangi greiðlega fyrir sig.',
      description: 'Contact info page description',
    },
    parentBDescription: {
      id: 'crc.application:section.backgroundInformation.contactInfo.parentBDescription#markdown',
      defaultMessage:
        'Sláðu inn tengiliðaupplýsingar þínar svo öll samskipti um umsóknina milli ykkar foreldranna og sýslumanns gangi greiðlega fyrir sig.',
      description: 'Contact info page description',
    },
  }),
  inputs: defineMessages({
    emailLabel: {
      id: 'crc.application:section.backgroundInformation.contactInfo.inputs.emailLabel',
      defaultMessage: 'Netfang',
      description: 'Email label',
    },
    phoneNumberLabel: {
      id: 'crc.application:section.backgroundInformation.contactInfo.inputs.phoneNumberLabel',
      defaultMessage: 'Símanúmer',
      description: 'Phone number label',
    },
  }),
  counterParty: defineMessages({
    info: {
      id: 'crc.application:section.backgroundInformation.contactInfo.counterParty.info',
      defaultMessage:
        'Hlekk á umsóknina verður deilt sjálfkrafa með hinu foreldrinu í SMS og/eða tölvupósti þegar þú hefur undirritað samninginn.',
      description: 'Counterparty information text',
    },
  }),
}

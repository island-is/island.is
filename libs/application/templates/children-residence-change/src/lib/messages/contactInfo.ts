import { defineMessages } from 'react-intl'

// Confirm Contact info
export const contactInfo = {
  general: defineMessages({
    sectionTitle: {
      id:
        'crc.application:section.backgroundInformation.contactInfo.sectionTitle',
      defaultMessage: 'Tengiliða upplýsingar',
      description: 'Contact info section title',
    },
    pageTitle: {
      id: 'crc.application:section.backgroundInformation.contactInfo.pageTitle',
      defaultMessage: 'Tengiliða upplýsingar',
      description: 'Contact info page title',
    },
    description: {
      id:
        'crc.application:section.backgroundInformation.contactInfo.description',
      defaultMessage: 'Sláðu inn netfang og símanúmer',
      description: 'Contact info page description',
    },
  }),
  inputs: defineMessages({
    emailLabel: {
      id:
        'crc.application:section.backgroundInformation.contactInfo.inputs.emailLabel',
      defaultMessage: 'Netfang',
      description: 'Email label',
    },
    phoneNumberLabel: {
      id:
        'crc.application:section.backgroundInformation.contactInfo.inputs.phoneNumberLabel',
      defaultMessage: 'Símanúmer',
      description: 'Phone number label',
    },
  }),
  counterParty: defineMessages({
    info: {
      id:
        'crc.application:section.backgroundInformation.contactInfo.counterParty.info',
      defaultMessage:
        'Hlekk á umsóknina verður deilt sjálfkrafa með hinu foreldrinu í SMS og/eða tölvupósti þegar þú hefur undirritað samninginn.',
      description: 'Counterparty information text',
    },
  }),
}

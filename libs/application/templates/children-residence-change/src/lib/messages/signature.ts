import { defineMessages } from 'react-intl'

// Signature
export const signature = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.contract.signature.sectionTitle',
      defaultMessage: 'Undirritun',
      description: 'Signature section title',
    },
    pageTitle: {
      id: 'crc.application:section.contract.signature.pageTitle',
      defaultMessage: 'Rafræn undirritun',
      description: 'Signature page title',
    },
  }),
  security: defineMessages({
    numberLabel: {
      id: 'crc.application:section.contract.signature.security.numberLabel',
      defaultMessage: 'Öryggistala:',
      description: 'Signature security number label',
    },
    message: {
      id: 'crc.application:section.contract.signature.security.text',
      defaultMessage:
        'Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama öryggistala birtist í símanum þínum.',
      description: 'Signature security text',
    },
  }),
}

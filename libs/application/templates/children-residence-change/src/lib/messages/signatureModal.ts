import { defineMessages } from 'react-intl'

// Signature
export const signatureModal = {
  general: defineMessages({
    title: {
      id: 'crc.application:section.contract.signatureModal.title',
      defaultMessage: 'Rafræn undirritun',
      description: 'Signature modal title',
    },
    closeButtonLabel: {
      id: 'crc.application:section.contract.signatureModal.closeButtonLabel',
      defaultMessage: 'Loka',
      description: 'Close modal button label',
    },
  }),
  security: defineMessages({
    numberLabel: {
      id:
        'crc.application:section.contract.signatureModal.security.numberLabel',
      defaultMessage: 'Öryggistala:',
      description: 'Signature security number label',
    },
    message: {
      id: 'crc.application:section.contract.signatureModal.security.text',
      defaultMessage:
        'Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama öryggistala birtist í símanum þínum.',
      description: 'Signature security text',
    },
  }),
  defaultError: defineMessages({
    title: {
      id: 'crc.application:section.contract.signatureModal.defaultError.title',
      defaultMessage: 'Villa kom upp við undirritun',
      description: 'Signature default error title',
    },
    message: {
      id:
        'crc.application:section.contract.signatureModal.defaultError.message',
      defaultMessage:
        'Það hefur eitthvað farið úrskeiðis við undirritun, vinsamlegast reynið aftur.',
      description: 'Signature default error message',
    },
  }),
}

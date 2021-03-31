import { defineMessages } from 'react-intl'

// Signature
export const signatureModal = {
  general: defineMessages({
    title: {
      id: 'crc.application:signatureModal.title',
      defaultMessage: 'Rafræn undirritun',
      description: 'Signature modal title',
    },
    closeButtonLabel: {
      id: 'crc.application:signatureModal.closeButtonLabel',
      defaultMessage: 'Loka',
      description: 'Close modal button label',
    },
  }),
  security: defineMessages({
    numberLabel: {
      id: 'crc.application:signatureModal.security.numberLabel',
      defaultMessage: 'Öryggistala:',
      description: 'Signature security number label',
    },
    message: {
      id: 'crc.application:signatureModal.security.text',
      defaultMessage:
        'Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama öryggistala birtist í símanum þínum.',
      description: 'Signature security text',
    },
  }),
  defaultError: defineMessages({
    title: {
      id: 'crc.application:signatureModal.defaultError.title',
      defaultMessage: 'Villa kom upp við undirritun',
      description: 'Signature default error title',
    },
    message: {
      id: 'crc.application:signatureModal.defaultError.message',
      defaultMessage:
        'Það hefur eitthvað farið úrskeiðis við undirritun, vinsamlegast reynið aftur.',
      description: 'Signature default error message',
    },
  }),
  error: defineMessages({
    userCancelled: {
      id: 'crc.application:signatureModal.error.userCancelled',
      defaultMessage: 'Auðkenning ekki kláruð.',
      description: 'User cancelled request error message',
    },
    timeOut: {
      id: 'crc.application:signatureModal.error.timeOut',
      defaultMessage: 'Auðkenning rann út á tíma',
      description: 'Request timed out error message',
    },
    noElectronicId: {
      id: 'crc.application:signatureModal.error.noElectronicId',
      defaultMessage: 'Símanúmer fannst ekki.',
      description: 'No electronic id connected to phone number error message',
    },
  }),
}

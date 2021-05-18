import { defineMessages } from 'react-intl'

// Signature
export const signatureModal = {
  general: defineMessages({
    title: {
      id: 'jca.application:signatureModal.title',
      defaultMessage: 'Þú ert að fara að undirrita',
      description: 'Signature modal title',
    },
    closeButtonLabel: {
      id: 'jca.application:signatureModal.closeButtonLabel',
      defaultMessage: 'Loka',
      description: 'Close modal button label',
    },
  }),
  success: defineMessages({
    title: {
      id: 'jca.application:signatureModal.success.title',
      defaultMessage: 'Undirritun tókst',
      description: 'Signature success title',
    },
    message: {
      id: 'jca.application:signatureModal.success.text',
      defaultMessage:
        'Augnablik. Við erum að taka saman gögnin þín, það getur tekið nokkrar sekúndur.',
      description: 'Signature success message',
    },
  }),
  security: defineMessages({
    numberLabel: {
      id: 'jca.application:signatureModal.security.numberLabel',
      defaultMessage: 'Öryggistala:',
      description: 'Signature security number label',
    },
    message: {
      id: 'jca.application:signatureModal.security.text',
      defaultMessage:
        'Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama öryggistala birtist í símanum þínum.',
      description: 'Signature security text',
    },
  }),
  defaultError: defineMessages({
    title: {
      id: 'jca.application:signatureModal.defaultError.title',
      defaultMessage: 'Villa kom upp við undirritun',
      description: 'Signature default error title',
    },
    message: {
      id: 'jca.application:signatureModal.defaultError.message',
      defaultMessage:
        'Það hefur eitthvað farið úrskeiðis við undirritun, vinsamlegast reynið aftur.',
      description: 'Signature default error message',
    },
  }),
  userCancelledWarning: defineMessages({
    title: {
      id: 'jca.application:signatureModal.userCancelledWarning.title',
      defaultMessage: 'Hætt var við undirritun',
      description: 'User cancelled request warning title',
    },
    message: {
      id: 'jca.application:signatureModal.userCancelledWarning.message',
      defaultMessage: 'Auðkenning ekki kláruð.',
      description: 'Signature user cancelled request warning message',
    },
  }),
  timeOutWarning: defineMessages({
    title: {
      id: 'jca.application:signatureModal.timeOutWarning.title',
      defaultMessage: 'Svar barst ekki',
      description: 'Signature time out warning title',
    },
    message: {
      id: 'jca.application:signatureModal.timeOutWarning.timeOut',
      defaultMessage: 'Auðkenning rann út á tíma',
      description: 'Signature request timed out warning message',
    },
  }),
  noElectronicIdError: defineMessages({
    title: {
      id: 'jca.application:signatureModal.noElectronicIdError.title',
      defaultMessage: 'Enginn rafræn skilríki fundust',
      description: 'No electronic id connected to phone number error title',
    },
    message: {
      id: 'jca.application:signatureModal.noElectronicIdError.messsage',
      defaultMessage: 'Símanúmer fannst ekki.',
      description: 'No electronic id connected to phone number error message',
    },
  }),
}

import { defineMessages } from 'react-intl'

export const applicationCheck = {
  validation: defineMessages({
    alertTitle: {
      id: 'ta.ovlp.application:applicationCheck.validation.alertTitle',
      defaultMessage: 'Það kom upp villa',
      description: 'Application check validation alert title',
    },
    alertInfoTitle: {
      id: 'ta.ovlp.application:applicationCheck.validation.alertInfoTitle',
      defaultMessage: 'Til athugunar!',
      description: 'Alert title',
    },
    fallbackErrorMessage: {
      id: 'ta.ovlp.application:applicationCheck.validation.fallbackErrorMessage',
      defaultMessage: 'Það kom upp villa við að sannreyna gögn',
      description: 'Fallback error message for validation',
    },
  }),
}

import { defineMessages } from 'react-intl'

export const error = defineMessages({
  numberValueIsNotWithinLimit: {
    id: 'ta.eft:error.numberValueIsNotWithinLimit',
    defaultMessage: 'Verður að vera á milli {min} og {max}',
    description: 'Error number value is not within limit',
  },
  submitErrorTitle: {
    id: 'ta.eft:error.submitErrorTitle',
    defaultMessage: 'Það kom upp villa',
    description: 'Error title when submitting application',
  },
  submitErrorFallbackMessage: {
    id: 'ta.eft:error.submitErrorFallbackMessage',
    defaultMessage: 'Það kom upp villa við að senda inn umsókn',
    description: 'Error fallback message when submitting application',
  },
})

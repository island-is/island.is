import { defineMessages } from 'react-intl'

export const declined = {
  general: defineMessages({
    sectionTitle: {
      id: 'gfl.application:declined.general.sectionTitle',
      defaultMessage: 'Umsókn hafnað',
      description: 'Application denied',
    },
  }),
  labels: defineMessages({
    helpText: {
      id: 'gfl.application:declined.labels.helpText',
      defaultMessage: '[declinedHelpText]',
      description: '[declinedHelpText]',
    },
    otherCountryTitle: {
      id: 'gfl.application:eclined.labels.otherCountryTitle',
      defaultMessage: '[declinedOtherCountryTitle]',
      description: '[declinedOtherCountryTitle]',
    },
    otherCountryDescription: {
      id: 'gfl.application:eclined.labels.otherCountryDescription',
      defaultMessage: '[declinedOtherCountryDescription]',
      description: '[declinedOtherCountryDescription]',
    },
  }),
}

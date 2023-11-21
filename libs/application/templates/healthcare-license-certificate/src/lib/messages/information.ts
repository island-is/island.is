import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'hlc.application:information.general.sectionTitle',
      defaultMessage: 'Starfsleyfi',
      description: 'Select license section title',
    },
  }),
  labels: {
    selectLicense: defineMessages({
      pageTitle: {
        id: 'hlc.application:information.labels.formerIcelander.pageTitle',
        defaultMessage: 'Starfsleyfin þín',
        description: 'formerIcelander title',
      },
      description: {
        id: 'hlc.application:information.labels.formerIcelander.description',
        defaultMessage:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dictum consequat justo in sagittis.',
        description: 'formerIcelander description',
      },
    }),
  },
}

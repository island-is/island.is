import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'uni.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Information section title',
    },
  }),
  labels: {
    programSelection: defineMessages({
      sectionTitle: {
        id: 'uni.application:information.labels.programSelection.sectionTitle',
        defaultMessage: 'Námsval',
        description: 'Program selection section title',
      },
      title: {
        id: 'uni.application:information.labels.programSelection.title',
        defaultMessage: 'Valið nám',
        description: 'Program selection title',
      },
    }),
  },
}

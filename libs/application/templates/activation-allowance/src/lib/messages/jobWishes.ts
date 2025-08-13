import { defineMessages } from 'react-intl'

export const jobWishes = {
  general: defineMessages({
    sectionTitle: {
      id: 'aa.application:jobWishes.general.sectionTitle',
      defaultMessage: 'Óskir um störf',
      description: 'Job history section title',
    },
    pageTitle: {
      id: 'aa.application:jobWishes.general.pageTitle',
      defaultMessage: 'Óskir um störf',
      description: `Job histry page title`,
    },
  }),
  labels: defineMessages({
    whatKindOfJob: {
      id: 'aa.application:jobWishes.labels.whatKindOfJob',
      defaultMessage: 'Hvernig starfi ertu að leita eftir? ',
      description: 'Job wishes what kind of job label',
    },
    escoInfo: {
      id: 'aa.application:jobWishes.labels.escoInfo',
      defaultMessage: 'Hér gæti komið útskýringartexti á ESCO kóðunum',
      description: 'ESCO information label',
    },
    jobs: {
      id: 'aa.application:jobWishes.labels.jobs',
      defaultMessage: 'Störf',
      description: 'Jobs label',
    },
  }),
}

import { defineMessages } from 'react-intl'

export const agent = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.rpr.application:agent.general.sectionTitle',
      defaultMessage: 'Umboðsmaður',
      description: 'Agent section title',
    },
  }),
  labels: defineMessages({
    pageTitle: {
      id: 'doi.rpr.application:agent.labels.pageTitle',
      defaultMessage: 'Umboðsmaður',
      description: 'Agent section page title',
    },
    description: {
      id: 'doi.rpr.application:agent.labels.description',
      defaultMessage:
        'Praesent euismod, nunc vel rutrum tristique, erat tortor scelerisque ex, suscipit blandit ipsum enim ut lacus.',
      description: 'Agent section description',
    },
    title: {
      id: 'doi.rpr.application:agent.labels.title',
      defaultMessage: 'Vilt þú hafa umbosðmann?',
      description: 'Agent title',
    },
  }),
}

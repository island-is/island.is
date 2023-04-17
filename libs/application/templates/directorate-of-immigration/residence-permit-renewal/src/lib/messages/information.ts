import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.rpr.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'doi.rpr.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
    description: {
      id: 'doi.rpr.application:information.general.description',
      defaultMessage:
        'Mauris lacus lorem, cursus ac ante nec, luctus lobortis orci',
      description: 'Description of information page',
    },
  }),
  labels: {
    test: defineMessages({
      sectionTitle: {
        id: 'doi.rpr.application:information.labels.test.sectionTitle',
        defaultMessage: 'Test',
        description: 'Test subsection section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.test.pageTitle',
        defaultMessage: 'Upplýsingar um test',
        description: 'Test subsection page title',
      },
      title: {
        id: 'doi.rpr.application:information.labels.test.title',
        defaultMessage: 'Test',
        description: 'Test subsection title',
      },
    }),
  },
}

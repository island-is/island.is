import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'pd.application:overview.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of overview section',
    },
    pageTitle: {
      id: 'pd.application:overview.general.pageTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of overview page',
    },
    description: {
      id: 'pd.application:overview.general.description',
      defaultMessage: 'This is an overview, should come from messages.ts',
      description: 'Description of overview page',
    },
  }),
  buttons: defineMessages({
    submit: {
      id: 'pd.application:overview.buttons.submit',
      defaultMessage: 'Submit',
      description: 'Submit application button',
    },
  }),
}

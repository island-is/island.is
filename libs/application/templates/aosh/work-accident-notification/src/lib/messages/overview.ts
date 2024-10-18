import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.wan.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Title of overview section',
    },
    description: {
      id: 'aosh.wan.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en skráningin er send.',
      description: 'Description of overview page',
    },
    pageTitle: {
      id: 'aosh.wan.application:overview.company.pageTitle',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Title of overview section',
    },
  }),
  labels: defineMessages({
    editMessage: {
      id: 'aosh.wan.application:overview.labels.editMessage',
      defaultMessage: 'Breyta upplýsingum',
      description: 'Edit message for button',
    },
    pageTitle: {
      id: 'aosh.wan.application:information.labels.pageTitle',
      defaultMessage: 'Fyrirtækið',
      description: 'Title of company information section',
    },
    description: {
      id: 'aosh.wan.application:overview.labels.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of company information page',
    },
    descriptionField: {
      id: 'aosh.wan.application:overview.labels.descriptionField',
      defaultMessage: 'Grunnupplýsingar',
      description: 'H5 of company information page',
    },
    title: {
      id: 'aosh.wan.application:overview.labels.title',
      defaultMessage: 'Grunnupplýsingar',
      description: 'Company information title',
    },
    nationalId: {
      id: 'aosh.wan.application:overview.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'Company information national ID label',
    },
    name: {
      id: 'aosh.wan.application:overview.labels.name',
      defaultMessage: 'Nafn',
      description: 'Company information name label',
    },
    address: {
      id: 'aosh.wan.application:overview.labels.address',
      defaultMessage: 'Heimilisfang',
      description: 'Company information address label',
    },
  }),
}

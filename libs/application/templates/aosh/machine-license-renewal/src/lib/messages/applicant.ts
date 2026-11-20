import { defineMessages } from 'react-intl'

export const applicant = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.mlr.application:applicant.general.sectionTitle',
      defaultMessage: 'Umsækjandi',
      description: 'Title of applicant section',
    },
    title: {
      id: 'aosh.mlr.application:applicant.general.title',
      defaultMessage: 'Umsækjandi',
      description: 'Title of applicant screen',
    },
  }),
  labels: defineMessages({
    alertMessage: {
      id: 'aosh.mlr.application:applicant.labels.alertMessage',
      defaultMessage:
        'Athugið að þetta er ekki að breyta upplýsingunum á mínum síðum',
      description:
        'Alert that changing email and phone number does not update my pages',
    },
  }),
}

import { defineMessages } from 'react-intl'

export const applicationStatus = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.tlwm.application:applicationStatus.general.sectionTitle',
      defaultMessage: 'Staða umsóknar',
      description: `Section title for application status`,
    },
    title: {
      id: 'aosh.tlwm.application:applicationStatus.general.title',
      defaultMessage: 'Staða umsóknar',
      description: 'Title for application status',
    },
    description: {
      id: 'aosh.tlwm.application:applicationStatus.general.description',
      defaultMessage: 'Hér að neðan kemur fram hvað gerist næst',
      description: 'Description for application status',
    },
  }),
  labels: defineMessages({
    actionCardTitle: {
      id: 'aosh.tlwm.application:applicationStatus.labels.actionCardTitle',
      defaultMessage: 'Samþykki vinnuveitanda',
      description: `pplication status action card title`,
    },
    actionCardMessage: {
      id: 'aosh.tlwm.application:applicationStatus.labels.actionCardMessage',
      defaultMessage:
        'Beðið er eftir að vinnuveitandi gefi út vottorð um starfstíma',
      description: `Application status action card message`,
    },
    actionCardTag: {
      id: 'aosh.tlwm.application:applicationStatus.labels.actionCardTag',
      defaultMessage: 'Samþykki í bið',
      description: `Application status action card tag`,
    },
  }),
}

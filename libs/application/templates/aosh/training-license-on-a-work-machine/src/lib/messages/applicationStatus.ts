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
      defaultMessage: 'Samþykki fyrir starfstíma á vinnuvélar: {value}',
      description: `pplication status action card title`,
    },
    actionCardTitleAssignee: {
      id: 'aosh.tlwm.application:applicationStatus.labels.actionCardTitleAssignee',
      defaultMessage: 'Samþykki staðfestingaraðila',
      description: `pplication status action card title for assignee`,
    },
    actionCardMessage: {
      id: 'aosh.tlwm.application:applicationStatus.labels.actionCardMessage',
      defaultMessage:
        'Beðið er eftir að samþykktaraðili staðfesti starfstíma á vinnuvél/ar',
      description: `Application status action card message`,
    },
    actionCardMessageApproved: {
      id: 'aosh.tlwm.application:applicationStatus.labels.actionCardMessageApproved',
      defaultMessage: 'Samþykktaraðili hefur staðfest starfstíma á vinnuvél/ar',
      description: `Application status action card message approved`,
    },
    actionCardMessageAssignee: {
      id: 'aosh.tlwm.application:applicationStatus.labels.actionCardMessageAssignee',
      defaultMessage:
        'Beðið er eftir að vinnuveitandi gefi út vottorð um starfstíma á vinnuvélum: {value}',
      description: `pplication status action card title for assignee`,
    },
    actionCardTag: {
      id: 'aosh.tlwm.application:applicationStatus.labels.actionCardTag',
      defaultMessage: 'Samþykki í bið',
      description: `Application status action card tag`,
    },
    actionCardTagApproved: {
      id: 'aosh.tlwm.application:applicationStatus.labels.actionCardTagApproved',
      defaultMessage: 'Samþykkt',
      description: `Application status action card tag approved`,
    },
  }),
}

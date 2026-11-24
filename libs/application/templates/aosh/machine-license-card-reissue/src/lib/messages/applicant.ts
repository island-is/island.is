import { defineMessages } from 'react-intl'

export const applicant = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.mlcr.application:applicant.general.sectionTitle',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant section title',
    },
    pageTitle: {
      id: 'aosh.mlcr.application:applicant.general.pageTitle',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant page title',
    },
  }),
  label: defineMessages({
    address: {
      id: 'aosh.mlcr.application:applicant.label.address',
      defaultMessage: 'Lögheimili',
      description: 'Label for the address field',
    },
    alertMessage: {
      id: 'aosh.mlcr.application:applicant.label.alertMessage',
      defaultMessage:
        'Vinsamlegast athugið að þetta er eingöngu að uppfæra upplýsingar fyrir þessa umsókn.',
      description: 'Alert message for the applicant',
    },
  }),
}

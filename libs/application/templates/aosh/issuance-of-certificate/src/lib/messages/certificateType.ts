import { defineMessages } from 'react-intl'

export const certificateType = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.ioc.application:certificateType.general.sectionTitle',
      defaultMessage: 'Tegund',
      description: `Section title for assignee information`,
    },
    title: {
      id: 'aosh.ioc.application:certificateType.general.title',
      defaultMessage: 'Tegund skírteinis',
      description: 'Title for assignee information',
    },
    description: {
      id: 'aosh.ioc.application:certificateType.general.description',
      defaultMessage: 'Vinsamlegast veldu það skírteini sem þú vilt endurnýja',
      description: 'Description for assignee information',
    },
  }),
  labels: defineMessages({
    workMachineCertificate: {
      id: 'aosh.ioc.application:certificateType.labels.tableButtonText',
      defaultMessage: 'Vinnuvélaskírteini',
      description: `Certificate type work machine certificate text`,
    },
    ADRCertificate: {
      id: 'aosh.ioc.application:certificateType.labels.company',
      defaultMessage: 'ADR skírteini',
      description: `Certificate type ADR certificate text`,
    },
  }),
}

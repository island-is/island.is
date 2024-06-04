import { defineMessages } from 'react-intl'

export const childInCustody = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:childInCustody.general.sectionTitle',
      defaultMessage: 'Upplýsingar um barn',
      description: 'Child information',
    },
    screenTitle: {
      id: 'an.application:childInCustody.general.screenTitle',
      defaultMessage: 'Upplýsingar um barn sem slasaðist',
      description: 'Information about the injured child',
    },
    screenDescription: {
      id: 'an.application:childInCustody.general.screenDescription',
      defaultMessage:
        'Ef tilkynning er sett fram barn, þá er nauðsynlegt að sá sem tilkynnir sé skráður forsjársaðili barnsins hjá Þjóðskrá Íslands.',
      description: `If a child is notified, it is necessary for the person notifying the child to be registered as the child's custodian.`,
    },
  }),
  labels: defineMessages({
    name: {
      id: 'an.application:childInCustody.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'an.application:childInCustody.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    email: {
      id: 'an.application:childInCustody.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'an.application:childInCustody.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
  }),
}

import { defineMessages } from 'react-intl'

export const rejected = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:rejected.general.title',
      defaultMessage: 'Umsókn hafnað',
    },
    intro: {
      id: 'ojoi.application:rejected.general.intro',
      defaultMessage:
        'Umsókninni þinni hefur verið hafnað, þú getur skoðað ástæður höfnunar í athugasemdum hér fyrir neðan.',
    },
    section: {
      id: 'ojoi.application:rejected.general.section',
      defaultMessage: 'Hafnað',
    },
    goToServicePortal: {
      id: 'ojoi.application:rejected.general.goToServicePortal',
      defaultMessage: 'Fara á upphafssíðu',
    },
  }),
}

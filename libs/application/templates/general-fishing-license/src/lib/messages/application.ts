import { defineMessages } from 'react-intl'

export const application = {
  general: defineMessages({
    name: {
      id: 'gfl.application:general.name',
      defaultMessage: 'Almennt veiðileyfi',
      description: 'General fishing license',
    },
    institutionName: {
      id: 'gfl.application:general.institutionName',
      defaultMessage: 'Fiskistofa',
      description: 'Institution name',
    },
  }),
  labels: defineMessages({
    actionCardPayment: {
      id: 'gfl.application:application.labels.actionCardPayment',
      defaultMessage: 'Greiðslu vantar',
      description:
        'Description of application state/status when payment is pending',
    },
  }),
}

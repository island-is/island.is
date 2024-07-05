import { defineMessages } from 'react-intl'

export const machine = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.rnm.application:machine.general.sectionTitle',
      defaultMessage: 'Upplýsingar um tæki',
      description: `Machine general section title`,
    },
  }),
  labels: {
    machineType: defineMessages({
      sectionTitle: {
        id: 'aosh.rnm.application:machine.labels.machineType.sectionTitle',
        defaultMessage: 'Tegund og gerð tækis',
        description: `Machine type section title`,
      },
      title: {
        id: 'aosh.rnm.application:machine.labels.machineType.title',
        defaultMessage: 'Tegund og gerð tækis',
        description: `Machine type page title`,
      },
      description: {
        id: 'aosh.rnm.application:machine.labels.machineType.description',
        defaultMessage: 'Sameiginlegar grunnupplýsingar',
        description: `Machine type page description`,
      },
      inputTitle: {
        id: 'aosh.rnm.application:machine.labels.machineType.inputTitle',
        defaultMessage: 'Vinsamlegast skráðu tegund og gerð tækis',
        description: `Machine type title for inputs`,
      },
      manufacturer: {
        id: 'aosh.rnm.application:machine.labels.machineType.manufacturer',
        defaultMessage: 'Tegund tækis / framleiðandi',
        description: `Machine type name label`,
      },
      type: {
        id: 'aosh.rnm.application:machine.labels.machineType.type',
        defaultMessage: 'Gerð',
        description: `Machine type nationalId label`,
      },
      warningAlertMessageTitle: {
        id: 'aosh.rnm.application:machine.labels.machineType.warningAlertMessageTitle',
        defaultMessage: 'Tegund/gerð tækis finnst ekki',
        description: `Machine type warning alert message title`,
      },
      warningAlertMessageDescription: {
        id: 'aosh.rnm.application:machine.labels.machineType.warningAlertMessageDescription',
        defaultMessage:
          'Vinsamlegast skráðu inn upplýsingar um tegund og gerð tækisins',
        description: `Machine type warning alert message description`,
      },
    }),
  },
}

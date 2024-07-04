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
        id: 'aosh.rnm.application:machine.labels.importer.sectionTitle',
        defaultMessage: 'Tegund og gerð tækis',
        description: `Machine type section title`,
      },
      title: {
        id: 'aosh.rnm.application:machine.labels.importer.title',
        defaultMessage: 'Tegund og gerð tækis',
        description: `Machine type page title`,
      },
      description: {
        id: 'aosh.rnm.application:machine.labels.importer.description',
        defaultMessage: 'Sameiginlegar grunnupplýsingar',
        description: `Machine type page description`,
      },
      isOwnerOtherThenImporter: {
        id: 'aosh.rnm.application:machine.labels.importer.isOwnerOtherThenImporter',
        defaultMessage: 'Vinsamlegast skráðu tegund og gerð tækis',
        description: `Is owner other than importer question label`,
      },
      name: {
        id: 'aosh.rnm.application:machine.labels.importer.name',
        defaultMessage: 'Nafn',
        description: `Machine type name label`,
      },
      nationalId: {
        id: 'aosh.rnm.application:machine.labels.importer.nationalId',
        defaultMessage: 'Kennitala',
        description: `Machine type nationalId label`,
      },
    }),
  },
}

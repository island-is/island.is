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
      type: {
        id: 'aosh.rnm.application:machine.labels.machineType.type',
        defaultMessage: 'Tegund tækis / framleiðandi',
        description: `Machine type name label`,
      },
      model: {
        id: 'aosh.rnm.application:machine.labels.machineType.model',
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
    basicMachineInformation: defineMessages({
      sectionTitle: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.sectionTitle',
        defaultMessage: 'Grunnupplýsingar',
        description: `Basic machine information section title`,
      },
      title: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.title',
        defaultMessage: 'Grunnupplýsingar',
        description: `Basic machine information page title`,
      },
      description: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.description',
        defaultMessage: 'Sameiginlegar grunnupplýsingar',
        description: `Basic machine information page description`,
      },
      aboutTitle: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.aboutTitle',
        defaultMessage: 'Um tækið',
        description: `Basic machine information about title`,
      },
      type: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.type',
        defaultMessage: 'Tegund tækis / framleiðandi',
        description: `Basic machine information type label`,
      },
      model: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.model',
        defaultMessage: 'Gerð',
        description: `Basic machine information model label`,
      },
      category: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.category',
        defaultMessage: 'Yfirflokkur',
        description: `Basic machine information category label`,
      },
      subcategory: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.subcategory',
        defaultMessage: 'Undirflokkur',
        description: `Basic machine information subcategory label`,
      },
      basicInformationTitle: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.basicInformationTitle',
        defaultMessage: 'Grunnupplýsingar',
        description: `Basic machine information basic information title`,
      },
      productionCountry: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.productionCountry',
        defaultMessage: 'Framleiðsluland',
        description: `Basic machine information production country label`,
      },
      productionYear: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.productionYear',
        defaultMessage: 'Framleiðsluár',
        description: `Basic machine information production year label`,
      },
      productionNumber: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.productionNumber',
        defaultMessage: 'Framleiðslunúmer',
        description: `Basic machine information production number label`,
      },
      markedCE: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.markedCE',
        defaultMessage: 'Er vélin CE merkt?',
        description: `Basic machine information marked CE label`,
      },
      preRegistration: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.preRegistration',
        defaultMessage: 'Forskráning',
        description: `Basic machine information pre-registration label`,
      },
      isUsed: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.isUsed',
        defaultMessage: 'Er vélin ný eða notuð?',
        description: `Basic machine information is used or new label`,
      },
      registrationInformationTitle: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.registrationInformationTitle',
        defaultMessage: 'Skráningaupplýsingar',
        description: `Basic machine information registration information title`,
      },
      location: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.location',
        defaultMessage: 'Staðsetning tækis við skráningu',
        description: `Basic machine information location label`,
      },
      cargoFileNumber: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.cargoFileNumber',
        defaultMessage: 'Farmskrárnúmer',
        description: `Basic machine information cargo file number label`,
      },
    }),
  },
}

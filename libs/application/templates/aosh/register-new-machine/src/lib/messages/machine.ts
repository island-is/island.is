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
      warningAlertMessageDescription: {
        id: 'aosh.rnm.application:machine.labels.machineType.warningAlertMessageDescription',
        defaultMessage:
          'Ef þú finnur ekki tegund og gerð tækis hér fyrir ofan, þá getur þú skráð það inn á næstu síðu.',
        description: `Machine type warning alert message description`,
      },
      errorAlertMessageDescription: {
        id: 'aosh.rnm.application:machine.labels.machineType.errorAlertMessageDescription',
        defaultMessage: 'Engin gerð fannst fyrir tiltekna tegund.',
        description: `Machine type warning alert message description`,
      },
      unknownType: {
        id: 'aosh.rnm.application:machine.labels.machineType.unknownType',
        defaultMessage: 'Finn ekki tegund',
        description: `Machine type unknown type message`,
      },
      unknownModel: {
        id: 'aosh.rnm.application:machine.labels.machineType.unknownModel',
        defaultMessage: 'Finn ekki gerð',
        description: `Machine type unknown model message`,
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
      overviewTitle: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.overviewTitle',
        defaultMessage: 'Grunnupplýsingar tækis',
        description: `Basic machine information overview title`,
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
      new: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.new',
        defaultMessage: 'Ný',
        description: `Basic machine information new label`,
      },
      used: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.used',
        defaultMessage: 'Notuð',
        description: `Basic machine information used label`,
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
      alertTitle: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.alertTitle',
        defaultMessage: 'CE merking',
        description: `Basic machine information alert title`,
      },
      alertMessage: {
        id: 'aosh.rnm.application:machine.labels.basicMachineInformation.alertMessage',
        defaultMessage:
          'Ef tæki er ekki CE merkt þarf að skila inn samræmisyfirlýsingu og fleiri viðbótargögnum.',
        description: `Basic machine information alert message`,
      },
    }),
    technicalMachineInformation: defineMessages({
      sectionTitle: {
        id: 'aosh.rnm.application:machine.labels.technicalMachineInformation.sectionTitle',
        defaultMessage: 'Tækniupplýsingar',
        description: `Technical machine information section title`,
      },
      title: {
        id: 'aosh.rnm.application:machine.labels.technicalMachineInformation.title',
        defaultMessage: 'Tækniupplýsingar',
        description: `Technical machine information page title`,
      },
      overviewTitle: {
        id: 'aosh.rnm.application:machine.labels.technicalMachineInformation.overviewTitle',
        defaultMessage: 'Tækniupplýsingar tækis',
        description: `Technical machine information overview title`,
      },
      description: {
        id: 'aosh.rnm.application:machine.labels.technicalMachineInformation.description',
        defaultMessage: 'Tæknilegar upplýsingar um tækið sem á að flytja inn',
        description: `Technical machine information page description`,
      },
      // This will be removed once we get these messages from the service.
      energySource: {
        id: 'aosh.rnm.application:machine.labels.technicalMachineInformation.energySource',
        defaultMessage: 'Orkugjafi',
        description: `Technical machine information type label`,
      },
      enginePower: {
        id: 'aosh.rnm.application:machine.labels.technicalMachineInformation.enginePower',
        defaultMessage: 'Afl hreyfils (kW)',
        description: `Technical machine information model label`,
      },
      ownWeight: {
        id: 'aosh.rnm.application:machine.labels.technicalMachineInformation.ownWeight',
        defaultMessage: 'Eigin þyngd (kg)',
        description: `Technical machine information category label`,
      },
      liftingCapactiy: {
        id: 'aosh.rnm.application:machine.labels.technicalMachineInformation.liftingCapactiy',
        defaultMessage: 'Lyftigeta (kg)',
        description: `Technical machine information subcategory label`,
      },
      voiceWorkshop: {
        id: 'aosh.rnm.application:machine.labels.technicalMachineInformation.category',
        defaultMessage: 'Hlassmiðja (mm)',
        description: `Technical machine information category label`,
      },
      liftHeight: {
        id: 'aosh.rnm.application:machine.labels.technicalMachineInformation.subcategory',
        defaultMessage: 'Lyftihæð (mm)',
        description: `Technical machine information subcategory label`,
      },
    }),
  },
}

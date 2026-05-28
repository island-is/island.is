import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.ovlp.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'ta.ovlp.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
    description: {
      id: 'ta.ovlp.application:information.general.description',
      defaultMessage: 'Skráningarskírteini er aðeins sent á lögheimili eigenda',
      description: 'Description of information page',
    },
  }),
  labels: {
    pickVehicle: defineMessages({
      sectionTitle: {
        id: 'ta.ovlp.application:information.labels.pickVehicle.sectionTitle',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle section title',
      },
      title: {
        id: 'ta.ovlp.application:information.labels.pickVehicle.title',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle title',
      },
      vehicle: {
        id: 'ta.ovlp.application:information.labels.pickVehicle.vehicle',
        defaultMessage: 'Ökutæki',
        description: 'Pick vehicle label',
      },
      placeholder: {
        id: 'ta.ovlp.application:information.labels.pickVehicle.placeholder',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle placeholder',
      },
      hasErrorTitle: {
        id: 'ta.ovlp.application:information.labels.pickVehicle.hasErrorTitle',
        defaultMessage: 'Ekki er hægt að velja þessa bifreið vegna:',
        description: 'Pick vehicle has an error title',
      },
      findPlatePlaceholder: {
        id: 'ta.ovlp.application:information.labels.pickVehicle.findPlatePlaceholder',
        defaultMessage: 'Sláðu inn plötunúmer',
        description: 'Pick vehicle find plate placeholder',
      },
      findButton: {
        id: 'ta.ovlp.application:information.labels.pickVehicle.findButton',
        defaultMessage: 'Leita',
        description: 'Pick vehicle find button',
      },
      notFoundTitle: {
        id: 'ta.ovlp.application:information.labels.pickVehicle.notFoundTitle',
        defaultMessage: 'Eitthvað fór úrskeiðis',
        description: 'vehicle not found',
      },
      notFoundMessage: {
        id: 'ta.ovlp.application:information.labels.pickVehicle.notFoundMessage',
        defaultMessage: 'Ökutæki með plötunúmerið {plate} fannst ekki',
        description: 'vehicle not found message',
      },
    }),
    plateType: defineMessages({
      sectionTitle: {
        id: 'ta.ovlp.application:information.labels.plateType.sectionTitle',
        defaultMessage: 'Tegund',
        description: 'Plate type section title',
      },
      title: {
        id: 'ta.ovlp.application:information.labels.plateType.title',
        defaultMessage: 'Tegund númeraplötu',
        description: 'Plate type title',
      },
      currentPlateLabel: {
        id: 'ta.ovlp.application:information.labels.plateType.currentPlateLabel',
        defaultMessage: 'Núverandi plata',
        description: 'Current plate label',
      },
      currentPlateSubLabel: {
        id: 'ta.ovlp.application:information.labels.plateType.currentPlateSubLabel',
        defaultMessage: 'Tegund númeraplötu',
        description: 'Current plate sub label',
      },
      availablePlateTypesLabel: {
        id: 'ta.ovlp.application:information.labels.plateType.availablePlateTypesLabel',
        defaultMessage: 'Veldu þá tegund sem þú vilt panta',
        description: 'Available plate types label',
      },
      error: {
        id: 'ta.ovlp.application:information.labels.plateType.error',
        defaultMessage:
          'Það kom upp villa við að sækja upplýsingar um tegund plötu',
        description: 'Plate type error message',
      },
      noPlateTypeFound: {
        id: 'ta.ovlp.application:information.labels.plateType.noPlateTypeFound',
        defaultMessage: 'Engin plötutegund fannst fyrir þetta ökutæki',
        description: 'No plate type found message',
      },
      vskAlertMessage: {
        id: 'ta.ovlp.application:information.labels.plateType.vskAlertMessage',
        defaultMessage:
          'Fara þarf með ökutækið í breytingarskoðun á skoðunarstöð til þess að hægt sé að breyta í notkunarflokkinn VSK. Skoðunarstofan sér um að afhenda plöturnar.',
        description: 'VSK plate type alert message',
      },
      aukamerkiAlertMessage: {
        id: 'ta.ovlp.application:information.labels.plateType.aukamerkiAlertMessage',
        defaultMessage:
          'Athugaðu að aukamerki eru til þess að nota ef eitthvað hindrar sýnina á númeraplötuna að aftan.',
        description: 'Aukamerki plate type alert message',
      },
    }),
    plateSize: defineMessages({
      sectionTitle: {
        id: 'ta.ovlp.application:information.labels.plateSize.sectionTitle',
        defaultMessage: 'Stærð',
        description: 'Plate size section title',
      },
      title: {
        id: 'ta.ovlp.application:information.labels.plateSize.title',
        defaultMessage: 'Stærð númeraplötu',
        description: 'Plate size title',
      },
      description: {
        id: 'ta.ovlp.application:information.labels.plateSize.description',
        defaultMessage:
          'Hægt er að panta bæði framan á og aftan á eða bara annað hvort.',
        description: 'Plate size description',
      },
      currentPlateTitle: {
        id: 'ta.ovlp.application:information.labels.plateSize.currentPlateTitle',
        defaultMessage: 'Núverandi plata',
        description: 'Current plate title',
      },
      frontPlateLabel: {
        id: 'ta.ovlp.application:information.labels.plateSize.frontPlateLabel',
        defaultMessage: 'Númeraplata að framan',
        description: 'Front plate label',
      },
      rearPlateLabel: {
        id: 'ta.ovlp.application:information.labels.plateSize.rearPlateLabel',
        defaultMessage: 'Númeraplata að aftan',
        description: 'Rear plate label',
      },
      vehicleSubTitle: {
        id: 'ta.ovlp.application:information.labels.plateSize.vehicleSubTitle',
        defaultMessage: 'Ökutæki',
        description: 'Plate size vehicle sub title',
      },
      vehiclePlate: {
        id: 'ta.ovlp.application:information.labels.plateSize.vehiclePlate',
        defaultMessage: 'Númer ökutækis',
        description: 'Plate size vehicle plate label',
      },
      vehicleType: {
        id: 'ta.ovlp.application:information.labels.plateSize.vehicleType',
        defaultMessage: 'Tegund ökutækis',
        description: 'Plate size vehicle type label',
      },
      frontPlateSubtitle: {
        id: 'ta.ovlp.application:information.labels.plateSize.frontPlateSubtitle',
        defaultMessage: 'Veldu stærð númeraplötu að framan',
        description: 'Plate size front plate sub title',
      },
      rearPlateSubtitle: {
        id: 'ta.ovlp.application:information.labels.plateSize.rearPlateSubtitle',
        defaultMessage: 'Veldu stærð númeraplötu að aftan',
        description: 'Plate size rear plate sub title',
      },
      plateSizeOptionTitle: {
        id: 'ta.ovlp.application:information.labels.plateSize.plateSizeOptionTitle',
        defaultMessage: 'Stærð {name} ({height}x{width}cm)',
        description: 'Plate size plate size option title',
      },
      error: {
        id: 'ta.ovlp.application:information.labels.plateSize.error',
        defaultMessage: 'Það kom upp villa við að sækja upplýsingar um bifreið',
        description: 'Plate size error message',
      },
      errorPlateTypeFront: {
        id: 'ta.ovlp.application:information.labels.plateSize.errorPlateTypeFront',
        defaultMessage: 'Skráning á núverandi plötustærð bíls er í ólagi',
        description: 'Plate type front error message',
      },
      noPlateMatchError: {
        id: 'ta.ovlp.application:information.labels.plateSize.noPlateMatchError',
        defaultMessage:
          'Plötutegund ekki til, vinsamlegast hafið samband við Samgönguskofu',
        description: 'No plate match error message',
      },
    }),
    plateDelivery: defineMessages({
      sectionTitle: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.sectionTitle',
        defaultMessage: 'Afhending',
        description: 'Plate delivery section title',
      },
      title: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.title',
        defaultMessage: 'Afhending merkis',
        description: 'Plate delivery title',
      },
      warningLostPlateTitle: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.warningLostPlateTitle',
        defaultMessage: 'ATH. Glatað skráningarmerki',
        description: 'Plate delivery warning lost plate title',
      },
      warningLostPlateSubTitle: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.warningLostPlateSubTitle',
        defaultMessage:
          'Ef skráningarmerki hefur glatast en fundist skal því skilað til Samgöngustofu eða á skoðunarstöð.',
        description: 'Plate delivery warning lost plate sub title',
      },
      subTitle: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.subTitle',
        defaultMessage: 'Veldu afhendingarstað skráningarmerkis',
        description: 'Plate delivery sub title',
      },
      transportAuthorityOptionTitle: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.transportAuthorityOptionTitle',
        defaultMessage: 'Samgöngustofa',
        description: 'Transport authority option title',
      },
      deliveryStationOptionTitle: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.deliveryStationOptionTitle',
        defaultMessage: 'Skoðunarstofa',
        description: 'Delivery station option title',
      },
      deliveryStationTitle: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.deliveryStationTitle',
        defaultMessage: 'Nafn skoðunarstofu',
        description: 'Delivery station title',
      },
      deliveryStationPlaceholder: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.deliveryStationPlaceholder',
        defaultMessage: 'Veldu skoðunarstofu',
        description: 'Delivery station placeholder',
      },
      includeRushFeeSubTitle: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.includeRushFeeSubTitle',
        defaultMessage: 'Þarft þú flýtimeðferð?',
        description: 'Include rush fee sub title',
      },
      includeRushFeeCheckboxTitle: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.includeRushFeeCheckboxTitle',
        defaultMessage: 'Flýtipöntun (afgreitt daginn eftir að greiðsla berst)',
        description: 'Include rush fee checkbox title',
      },
      includeRushFeeCheckboxSubTitle: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.includeRushFeeCheckboxSubTitle',
        defaultMessage: 'Flýtigjald:',
        description: 'Include rush fee checkbox sub title',
      },
    }),
  },
}

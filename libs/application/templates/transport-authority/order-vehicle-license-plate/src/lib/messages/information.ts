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
    }),
    plateSize: defineMessages({
      sectionTitle: {
        id: 'ta.ovlp.application:information.labels.plateSize.sectionTitle',
        defaultMessage: 'Stærð',
        description: 'Plate size section title',
      },
      title: {
        id: 'ta.ovlp.application:information.labels.plateSize.title',
        defaultMessage: 'Stærð skráningarmerkis',
        description: 'Plate size title',
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
        defaultMessage: 'Veldu stærð merkis að framan',
        description: 'Plate size front plate sub title',
      },
      rearPlateSubtitle: {
        id: 'ta.ovlp.application:information.labels.plateSize.rearPlateSubtitle',
        defaultMessage: 'Veldu stærð merkis að aftan',
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

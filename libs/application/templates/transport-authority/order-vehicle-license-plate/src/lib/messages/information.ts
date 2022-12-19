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
    }),
    plateReason: defineMessages({
      sectionTitle: {
        id: 'ta.ovlp.application:information.labels.plateReason.sectionTitle',
        defaultMessage: 'Ástæða',
        description: 'Plate size section title',
      },
      title: {
        id: 'ta.ovlp.application:information.labels.plateReason.title',
        defaultMessage: 'Ástæða pöntunar',
        description: 'Plate size title',
      },
      subTitle: {
        id: 'ta.ovlp.application:information.labels.plateReason.subTitle',
        defaultMessage:
          'Vinsamlegast tilgreindu ástæðu pöntunar skráningarmerkis',
        description: 'Plate size sub title',
      },
      newOptionTitle: {
        id: 'ta.ovlp.application:information.labels.plateReason.newOptionTitle',
        defaultMessage: 'Nýtt skráningarmerki/endurnýjun á skráningarmerki',
        description: 'New option title',
      },
      newOptionSubTitle: {
        id:
          'ta.ovlp.application:information.labels.plateReason.newOptionSubTitle',
        defaultMessage:
          'Athugið að skila þarf inn eldra skráningarmerki ef um endurnýjun er að ræða.',
        description: 'New option sub title',
      },
      lostOptionTitle: {
        id:
          'ta.ovlp.application:information.labels.plateReason.lostOptionTitle',
        defaultMessage: 'Glatað skráningarmerki',
        description: 'Lost option title',
      },
      lostOptionSubTitle: {
        id:
          'ta.ovlp.application:information.labels.plateReason.lostOptionSubTitle',
        defaultMessage:
          'Ég staðfesti hér með að skráningarmerki hefur glatast. Ef það finnst verður því skilað til Samgöngustofu eða á skoðunarstöð.',
        description: 'Lost option sub title',
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
        id:
          'ta.ovlp.application:information.labels.plateSize.frontPlateSubtitle',
        defaultMessage: 'Veldu stærð merkis að framan',
        description: 'Plate size front plate sub title',
      },
      frontPlateSizeAOptionTitle: {
        id:
          'ta.ovlp.application:information.labels.plateSize.frontPlateSizeAOptionTitle',
        defaultMessage: 'Stærð A (110x520cm)',
        description: 'Plate size front plate size A option title',
      },
      frontPlateSizeBOptionTitle: {
        id:
          'ta.ovlp.application:information.labels.plateSize.frontPlateSizeBOptionTitle',
        defaultMessage: 'Stærð B (200x280cm)',
        description: 'Plate size front plate size B option title',
      },
      rearPlateSubtitle: {
        id:
          'ta.ovlp.application:information.labels.plateSize.rearPlateSubtitle',
        defaultMessage: 'Veldu stærð merkis að framan',
        description: 'Plate size front plate sub title',
      },
      rearPlateSizeAOptionTitle: {
        id:
          'ta.ovlp.application:information.labels.plateSize.rearPlateSizeAOptionTitle',
        defaultMessage: 'Stærð A (110x520cm)',
        description: 'Plate size front plate size A option title',
      },
      rearPlateSizeBOptionTitle: {
        id:
          'ta.ovlp.application:information.labels.plateSize.rearPlateSizeBOptionTitle',
        defaultMessage: 'Stærð B (200x280cm)',
        description: 'Plate size front plate size B option title',
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
      subTitle: {
        id: 'ta.ovlp.application:information.labels.plateDelivery.subTitle',
        defaultMessage: 'Veldu afhendingarstað skráningarmerkis',
        description: 'Plate delivery sub title',
      },
      transportAuthorityOptionTitle: {
        id:
          'ta.ovlp.application:information.labels.plateDelivery.transportAuthorityOptionTitle',
        defaultMessage: 'Samgöngustofa',
        description: 'Transport authority option title',
      },
      deliveryStationOptionTitle: {
        id:
          'ta.ovlp.application:information.labels.plateDelivery.deliveryStationOptionTitle',
        defaultMessage: 'Skoðunarstofa',
        description: 'Delivery station option title',
      },
    }),
  },
}

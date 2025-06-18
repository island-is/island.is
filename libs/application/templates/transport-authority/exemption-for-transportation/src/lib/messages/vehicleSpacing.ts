import { defineMessages } from 'react-intl'

export const vehicleSpacing = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:vehicleSpacing.general.sectionTitle',
      defaultMessage: 'Bil milli vagna',
      description: 'Title of vehicle spacing section',
    },
    pageTitle: {
      id: 'ta.eft.application:vehicleSpacing.general.pageTitle',
      defaultMessage: 'Bil milli vagna',
      description: 'Title of vehicle spacing page',
    },
    description: {
      id: 'ta.eft.application:vehicleSpacing.general.description',
      defaultMessage:
        'Gefa þarf upp bil í metrum milli aftasta öxuls ökutækis í fremsta öxul næsta ökutækis fyrir hvert ökutæki í vagnlest',
      description: 'Description of vehicle spacing page',
    },
    convoySubtitle: {
      id: 'ta.eft.application:vehicleSpacing.general.convoySubtitle',
      defaultMessage: 'Bil í vagnlest {convoyNumber}',
      description: 'Convoy subtitle',
    },
    convoyDescription: {
      id: 'ta.eft.application:vehicleSpacing.general.convoyDescription',
      defaultMessage: 'Ökutæki - {vehiclePermno}, eftirvagn - {trailerPermno}',
      description: 'Convoy description',
    },
  }),
  labels: defineMessages({
    vehicleToDolly: {
      id: 'ta.eft.application:vehicleSpacing.labels.vehicleToDolly',
      defaultMessage: 'Ökutæki í dollý',
      description: 'Vehicle space from vehicle to dolly label',
    },
    dollyToTrailer: {
      id: 'ta.eft.application:vehicleSpacing.labels.dollyToTrailer',
      defaultMessage: 'Dollý í eftirvagn',
      description: 'Vehicle space from dolly to trailer label',
    },
    vehicleToTrailer: {
      id: 'ta.eft.application:vehicleSpacing.labels.vehicleToTrailer',
      defaultMessage: 'Ökutæki í eftirvagn',
      description: 'Vehicle space from vehicle to trailer label',
    },
    metersSuffix: {
      id: 'ta.eft.application:vehicleSpacing.labels.metersSuffix',
      defaultMessage: ' metrar',
      description: 'Meters suffix',
    },
  }),
}

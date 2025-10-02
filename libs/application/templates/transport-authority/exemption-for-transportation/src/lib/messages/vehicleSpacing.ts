import { defineMessages } from 'react-intl'

export const vehicleSpacing = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:vehicleSpacing.general.sectionTitle',
      defaultMessage: 'Bil milli bíls og eftirvagns',
      description: 'Title of vehicle spacing section',
    },
    pageTitle: {
      id: 'ta.eft.application:vehicleSpacing.general.pageTitle',
      defaultMessage: 'Bil milli bíls og eftirvagns',
      description: 'Title of vehicle spacing page',
    },
    description: {
      id: 'ta.eft.application:vehicleSpacing.general.description',
      defaultMessage:
        'Gefa þarf upp bil í metrum milli aftasta öxuls bíls og fremsta öxul eftirvagns eða dollý.',
      description: 'Description of vehicle spacing page',
    },
    convoySubtitle: {
      id: 'ta.eft.application:vehicleSpacing.general.convoySubtitle',
      defaultMessage: 'Bil í vagnlest {convoyNumber}',
      description: 'Convoy subtitle',
    },
    convoyDescription: {
      id: 'ta.eft.application:vehicleSpacing.general.convoyDescription',
      defaultMessage: 'Bíll - {vehiclePermno}, eftirvagn - {trailerPermno}',
      description: 'Convoy description',
    },
  }),
  labels: defineMessages({
    vehicleToDolly: {
      id: 'ta.eft.application:vehicleSpacing.labels.vehicleToDolly',
      defaultMessage: 'Bíll í dollý',
      description: 'Vehicle space from vehicle to dolly label',
    },
    dollyToTrailer: {
      id: 'ta.eft.application:vehicleSpacing.labels.dollyToTrailer',
      defaultMessage: 'Dollý í eftirvagn',
      description: 'Vehicle space from dolly to trailer label',
    },
    vehicleToTrailer: {
      id: 'ta.eft.application:vehicleSpacing.labels.vehicleToTrailer',
      defaultMessage: 'Bíll í eftirvagn',
      description: 'Vehicle space from vehicle to trailer label',
    },
    metersSuffix: {
      id: 'ta.eft.application:vehicleSpacing.labels.metersSuffix',
      defaultMessage: ' metrar',
      description: 'Meters suffix',
    },
  }),
}

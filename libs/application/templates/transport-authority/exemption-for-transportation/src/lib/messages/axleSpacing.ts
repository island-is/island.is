import { defineMessages } from 'react-intl'

export const axleSpacing = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:axleSpacing.general.sectionTitle',
      defaultMessage: 'Bil milli öxla',
      description: 'Title of axle spacing section',
    },
    pageTitle: {
      id: 'ta.eft.application:axleSpacing.general.pageTitle',
      defaultMessage: 'Bil milli öxla',
      description: 'Title of axle spacing page',
    },
    description: {
      id: 'ta.eft.application:axleSpacing.general.description',
      defaultMessage:
        'Gefa þarf upp bil í metrum milli allra öxla á ökutækjum í vagnlest og einnig á milli ökutækja / vagna.',
      description: 'Description of axle spacing page',
    },
    vehicleSubtitle: {
      id: 'ta.eft.application:axleSpacing.general.vehicleSubtitle',
      defaultMessage: 'Ökutæki - {vehiclePermno}',
      description: 'Vehicle subtitle',
    },
    doubleDollySubtitle: {
      id: 'ta.eft.application:axleSpacing.general.doubleDollySubtitle',
      defaultMessage: 'Tvöfalt dollý',
      description: 'Double dolly subtitle',
    },
    trailerSubtitle: {
      id: 'ta.eft.application:axleSpacing.general.trailerSubtitle',
      defaultMessage: 'Eftirvagn - {trailerPermno}',
      description: 'Trailer subtitle',
    },
  }),
  labels: defineMessages({
    numberOfAxles: {
      id: 'ta.eft.application:axleSpacing.labels.numberOfAxles',
      defaultMessage: 'Fjöldi öxla: {numberOfAxles}',
      description: 'Number of axles label',
    },
    axleSpaceFromTo: {
      id: 'ta.eft.application:axleSpacing.labels.axleSpaceFromTo',
      defaultMessage: 'Bil milli öxla {axleNumberFrom} og {axleNumberTo}',
      description: 'Axle space from to label',
    },
    metersSuffix: {
      id: 'ta.eft.application:axleSpacing.labels.metersSuffix',
      defaultMessage: ' metrar',
      description: 'Meters suffix',
    },
  }),
}

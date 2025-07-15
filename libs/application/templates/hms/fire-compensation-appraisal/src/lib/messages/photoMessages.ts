import { defineMessages } from 'react-intl'

export const photoMessages = defineMessages({
  title: {
    id: 'fca.application:photo.title',
    defaultMessage: 'Myndir af breytingum',
    description: 'Photo section title',
  },
  description: {
    id: 'fca.application:photo.description',
    defaultMessage:
      'Hér setur þú inn myndir af því sem þú taldir upp á lýsingu á framkvæmdum og sýnir frágang.\n\nUmsækjandi er hvattur til að hlaða upp myndum sem gagnast við gerð brunabótamatsins svo að það byggi á réttum upplýsingum.\n\nTakið eftir að það þarf að hlaða upp í það minnsta **3 myndum** og í mesta lagi **10 myndum** til að geta sótt um endurmat brunabótamats.',
    description: 'Photo section description',
  },
  alertMessage: {
    id: 'fca.application:photo.alertMessage',
    defaultMessage:
      'Þú þarft að hlaða upp í það minnsta 3 myndum til að geta sótt um endurmat brunabótamats.',
    description: 'Photo section alert message',
  },
  maxPhotos: {
    id: 'fca.application:photo.maxPhotos',
    defaultMessage: 'Þú getur ekki hlaðið upp fleiri en 10 myndum.',
    description: 'Photo section max photos',
  },
})

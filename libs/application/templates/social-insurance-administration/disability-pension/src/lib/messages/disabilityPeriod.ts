import { defineMessages } from 'react-intl'

export const disabilityPeriod = defineMessages({
  title: {
    id: 'dp.application:disabilityPeriod.title',
    description: 'Retroactive payments',
    defaultMessage: 'Afturvirkar greiðslur',
  },
  tabTitle: {
    id: 'dp.application:disabilityPeriod.retroactive.payments',
    description: 'From what time are you applying for payments?',
    defaultMessage: 'Sækja aftur í tímann',
  },
  description: {
    id: 'dp.application:disabilityPeriod.description',
    defaultMessage:
      'Hægt er að sækja um greiðslur í allt að 2 ár afturvirkt, athygli er vakin á að gögn þurfa að rökstyðja afturvirkar greiðslur.',
    description: 'Description for disability period',
  },
  chooseDate: {
    id: 'dp.application:disabilityPeriod.chooseDate',
    defaultMessage: 'Veldu dagsetningu sem þú vilt hefja töku örorku',
    description: 'Select date',
  },
  chosenDate: {
    id: 'dp.application:disabilityPeriod.chosenDate',
    defaultMessage: 'Dagsetning sem taka örorku skal hefjast',
    description: 'What date should the disability period start',
  },
})

import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'pd.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsluyfirlit',
      description: 'Title of payment section',
    },
  }),
  description: defineMessages({
    title: {
      id: 'pd.application:payment.description.title',
      defaultMessage: 'Description',
      description: 'Title of payment description field',
    },
    description: {
      id: 'pd.application:payment.description.description',
      defaultMessage:
        'Yfirlit þeirra skulda sem hægt er að greiða til ríkisins. Nánara yfirlit og sundurliðun skulda er undir Fjármál á Mínum Síðum.',
      description: 'Description of payment description field',
    },
  }),
  radio: defineMessages({
    title: {
      id: 'pd.application:payment.radio.title',
      defaultMessage: 'Radio',
      description: 'Title of payment radio field',
    },
    description: {
      id: 'pd.application:payment.radio.description',
      defaultMessage:
        'This is a radio desctiption, should come from messages.ts',
      description: 'Description of payment radio field',
    },
    option1Label: {
      id: 'pd.application:payment.radio.option1Label',
      defaultMessage: 'Option 1',
      description: 'Label of payment radio first option',
    },
    option2Label: {
      id: 'pd.application:payment.radio.option2Label',
      defaultMessage: 'Option 2',
      description: 'Label of payment radio second option',
    },
  }),
}

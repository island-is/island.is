import { defineMessages } from 'react-intl'

export const firstSection = {
  general: defineMessages({
    sectionTitle: {
      id: 'pd.application:firstSection.general.sectionTitle',
      defaultMessage: 'Skuldastaða',
      description: 'Title of first section',
    },
  }),
  description: defineMessages({
    title: {
      id: 'pd.application:firstSection.description.title',
      defaultMessage: 'Skuldastaða',
      description: 'Title of description field',
    },
    description: {
      id: 'pd.application:firstSection.description.description',
      defaultMessage: 'Yfirlit þeirra skulda sem hægt er að greiða til ríkisins. Nánara yfirlit og sundurliðun skulda er undir Fjármál á Mínum Síðum.',
      description: 'Description of description field',
    },
  }),
  input: defineMessages({
    title: {
      id: 'pd.application:firstSection.input.title',
      defaultMessage: 'Input',
      description: 'Title of input field',
    },
    description: {
      id: 'pd.application:firstSection.input.description',
      defaultMessage: 'This is an input, should come from messages.ts',
      description: 'Description of input field',
    },
  }),
}

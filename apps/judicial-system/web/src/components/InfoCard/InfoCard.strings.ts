import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  spokesperson: {
    id: 'judicial.system.core:info_card.spokesperson',
    defaultMessage: 'Talsmaður',
    description: 'Notaður sem titill á "talsmanni" á upplýsingaspjaldi máls.',
  },
  defender: {
    id: 'judicial.system.core:info_card.defender',
    defaultMessage: 'Verjandi',
    description: 'Notaður sem titill á "verjanda" á upplýsingaspjaldi máls.',
  },
  defenders: {
    id: 'judicial.system.core:info_card.defenders',
    defaultMessage: 'Verjendur',
    description: 'Notaður sem titill á "verjendum" á upplýsingaspjaldi máls.',
  },
  noDefender: {
    id: 'judicial.system.core:info_card.no_defender',
    defaultMessage: 'Hefur ekki verið skráður',
    description: 'Notaður sem texti þegar enginn verjandi er skráður.',
  },
})

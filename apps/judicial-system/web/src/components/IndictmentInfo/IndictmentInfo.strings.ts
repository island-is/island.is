import { defineMessages } from 'react-intl'

export const indictmentInfo = defineMessages({
  subtypes: {
    id: 'judicial.system.core:indictment_info.subtypes',
    defaultMessage: 'Sakarefni: {subtypes}',
    description: 'Notaður sem texti fyrir undirtegund ákæru.',
  },
  dateAndPlace: {
    id: 'judicial.system.core:indictment_info.subtype',
    defaultMessage: 'Vettvangur og tími: {place} - {date}',
    description: 'Notaður sem texti fyrir vettvang og tíma ákæru.',
  },
})

import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:court.request_ruling_signature_modal.title',
    defaultMessage: 'Viltu undirrita leiðréttan úrskurð?',
    description:
      'Notaður sem titill í modal til að óska eftir undirritun leiðrétts úrskurðar.',
  },
  description: {
    id: 'judicial.system.core:court.request_ruling_signature_modal.description',
    defaultMessage:
      'Ef leiðréttur úrskurður er ekki undirritaður þá gildir fyrri úrskurður áfram.',
    description:
      'Notaður sem texti í modal til að óska eftir undirritun leiðrétts úrskurðar.',
  },
  yes: {
    id: 'judicial.system.core:court.request_ruling_signature_modal.yes',
    defaultMessage: 'Já',
    description:
      'Notaður sem texti á já takka í modal til að óska eftir undirritun leiðrétts úrskurðar.',
  },
  no: {
    id: 'judicial.system.core:court.request_ruling_signature_modal.no',
    defaultMessage: 'Nei',
    description:
      'Notaður sem texti á nei takka í modal til að óska eftir undirritun leiðrétts úrskurðar.',
  },
})

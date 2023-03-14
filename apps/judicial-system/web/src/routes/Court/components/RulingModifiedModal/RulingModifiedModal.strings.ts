import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:ruling_modified_modal.title',
    defaultMessage: 'Hverju var breytt?',
    description:
      'Notaður sem titill á modal til að skrá breytingar á úrskurði.',
  },
  text: {
    id: 'judicial.system.core:ruling_modified_modal.text',
    defaultMessage:
      'Skráðu hvað var leiðrétt í úrskurðinum eða þingbókinni. Aðilar máls munu fá skilaboðin og tilkynningu um að nýr úrskurður hafi verið undirritaður.',
    description: 'Notaður sem texti í modal til að skrá breytingar á úrskurði.',
  },
  continue: {
    id: 'judicial.system.core:ruling_modified_modal.continue',
    defaultMessage: 'Undirrita',
    description:
      'Notaður sem texti á halda áfram takka í modal til að skrá breytingar á úrskurði.',
  },
  cancel: {
    id: 'judicial.system.core:ruling_modified_modal.cancel',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti á hætta við takka í modal til að skrá breytingar á úrskurði.',
  },
})

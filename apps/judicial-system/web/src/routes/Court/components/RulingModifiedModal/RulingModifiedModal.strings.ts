import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  description: {
    id: 'judicial.system.core:court.ruling_modified_modal.description',
    defaultMessage:
      'Skráðu hvað var leiðrétt í úrskurðinum eða þingbókinni. Aðilar máls munu fá skilaboðin.',
    description: 'Notaður sem texti í modal til að skrá breytingar á úrskurði.',
  },
  autofill: {
    id: 'judicial.system.core:court.ruling_modified_modal.autofill',
    defaultMessage:
      'Með heimild í 3. mgr. 186. gr. laga nr. 88/2008 hefur úrskurður verið leiðréttur.',
    description:
      'Notaður sem sjálfvirkur texti í input svæði í modal til að skrá breytingar á úrskurði.',
  },
})

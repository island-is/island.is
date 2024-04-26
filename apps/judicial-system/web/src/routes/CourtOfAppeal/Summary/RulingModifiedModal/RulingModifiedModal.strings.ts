import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  description: {
    id: 'judicial.system.core:court_of_appeal.ruling_modified_modal.description',
    defaultMessage:
      'Skráðu hvað var leiðrétt í úrskurðinum. Aðilar máls munu fá skilaboðin og tilkynningu um nýjan úrskurð.',
    description:
      'Notaður sem texti í modal til að skrá breytingar á úrskurði á Landsréttar úrskurðarskjá.',
  },
  autofill: {
    id: 'judicial.system.core:court_of_appeal.ruling_modified_modal.autofill',
    defaultMessage:
      'Dómar og úrskurðir í Landsrétti eru leiðréttir með vísan til 3. mgr. 186. gr., sbr. 210. gr. laga nr. 88/2008.',
    description:
      'Notaður sem sjálfvirkur texti í input svæði í modal til að skrá breytingar á kæruúrskurði.',
  },
})

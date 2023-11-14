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
  appealRulingText: {
    id: 'judicial.system.core:ruling_modified_modal.appeal_ruling_text',
    defaultMessage:
      'Skráðu hvað var leiðrétt í úrskurðinum. Aðilar máls munu fá skilaboðin og tilkynningu um nýjan úrskurð.',
    description:
      'Notaður sem texti í modal til að skrá breytingar á úrskurði á Landsréttar úrskurðarskjá.',
  },
  rulingContinue: {
    id: 'judicial.system.core:ruling_modified_modal.ruling_continue',
    defaultMessage: 'Undirrita',
    description:
      'Notaður sem texti á halda áfram takka í modal til að skrá breytingar á úrskurði.',
  },
  appealRulingContinue: {
    id: 'judicial.system.core:ruling_modified_modal.appeal_ruling_continue',
    defaultMessage: 'Ljúka máli',
    description:
      'Notaður sem texti á halda áfram takka í modal til að skrá breytingar á kæruúrskurði.',
  },
  cancel: {
    id: 'judicial.system.core:ruling_modified_modal.cancel',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti á hætta við takka í modal til að skrá breytingar á úrskurði.',
  },
  label: {
    id: 'judicial.system.core:ruling_modified_modal.label',
    defaultMessage: 'Hverju var breytt?',
    description:
      'Notaður sem label í input svæði í modal til að skrá breytingar á úrskurði.',
  },
  rulingAutofill: {
    id: 'judicial.system.core:ruling_modified_modal.ruling_autofill',
    defaultMessage:
      'Með heimild í 3. mgr. 186. gr. laga nr. 88/2008 hefur úrskurður verið leiðréttur.',
    description:
      'Notaður sem sjálfvirkur texti í input svæði í modal til að skrá breytingar á úrskurði.',
  },
  appealRulingAutofill: {
    id: 'judicial.system.core:ruling_modified_modal.appeal_ruling_autofill',
    defaultMessage:
      'Dómar og úrskurðir í Landsrétti eru leiðréttir með vísan til 3. mgr. 186. gr., sbr. 210. gr. laga nr. 88/2008.',
    description:
      'Notaður sem sjálfvirkur texti í input svæði í modal til að skrá breytingar á kæruúrskurði.',
  },
})

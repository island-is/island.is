import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:court.indictments.conclusion.title',
    defaultMessage: 'Niðurstaða',
    description:
      'Notaður sem titill á síðu á Niðurstaða ákæru skrefi í dómaraflæði.',
  },
  decisionTitle: {
    id: 'judicial.system.core:court.indictments.conclusion.decision_title',
    defaultMessage: 'Staða',
    description: 'Notaður sem titill á Staða hluta á Niðurstaða skrefi.',
  },
  postponed: {
    id: 'judicial.system.court.indictments.conclusion.postponed',
    defaultMessage: 'Frestun',
    description: 'Notaður sem texti fyrir frestun valkost á Niðurstaða skrefi.',
  },
  arrangeAnotherHearing: {
    id: 'judicial.system.core:court.indictments.conclusion.arrange_another_hearing',
    defaultMessage: 'Bóka annað þinghald',
    description:
      'Notaður sem texti fyrir bóka annað þinghald valkost á Niðurstaða skrefi.',
  },
  postponedIndefinitely: {
    id: 'judicial.system.core:court.indictments.conclusion.postponed_indefinitely',
    defaultMessage: 'Frestað um ótilgreindan tíma',
    description:
      'Notaður sem texti fyrir frestað um ótilgreindan tíma valkost á Niðurstaða skrefi.',
  },
  reasonForPostponement: {
    id: 'judicial.system.core:court.indictments.conclusion.reason_for_postponement',
    defaultMessage: 'Ástæða frestunar',
    description:
      'Notaður sem titill á ástæða frestunar textabox á Niðurstaða skrefi.',
  },
  reasonForPostponementPlaceholder: {
    id: 'judicial.system.core:court.indictments.conclusion.reason_for_postponement_placeholder',
    defaultMessage: 'Skráðu ástæðu fyrir frestun um ótilgreindan tíma',
    description:
      'Notaður sem skýritexti í ástæða frestunar textabox á Niðurstaða skrefi.',
  },
  courtRecordTitle: {
    id: 'judicial.system.core:court.indictments.conclusion.court_record_title',
    defaultMessage: 'Þingbók',
    description:
      'Notaður sem titill á þingbókar hluta á Niðurstaða skrefi í ákærum í dómaraflæði.',
  },
  rulingTitle: {
    id: 'judicial.system.core:court.indictments.conclusion.ruling_title',
    defaultMessage: 'Dómur',
    description: 'Notaður sem titill á dómur hluta á Niðurstaða skrefi.',
  },
  inputFieldLabel: {
    id: 'judicial.system.core:court.indictments.conclusion.input_field_label',
    defaultMessage: 'Dragðu gögn hingað til að hlaða upp',
    description:
      'Notaður sem titill á hlaða upp gögnum hlutum á Niðurstaða skrefi.',
  },
  uploadButtonText: {
    id: 'judicial.system.core:court.indictments.conclusion.upload_button_text',
    defaultMessage: 'Velja gögn til að hlaða upp',
    description: 'Notaður sem titill á hlaða upp takka á Niðurstaða skrefi.',
  },
  nextButtonText: {
    id: 'judicial.system.core:court.indictments.conclusion.next_button_text',
    defaultMessage: 'Staðfesta',
    description: 'Notaður sem titill á Staðfesta takka á Niðurstaða skrefi.',
  },
  modalTitle: {
    id: 'judicial.system.core:court.indictments.conclusion.modal_title',
    defaultMessage: 'Máli hefur verið lokið',
    description:
      'Notaður sem titill í modal glugga eftir að máli er lokið í ákærum.',
  },
  modalText: {
    id: 'judicial.system.core:court.indictments.conclusion.modal_text',
    defaultMessage:
      'Tilkynning hefur verið send ákæranda og verjanda í málinu.',
    description:
      'Notaður sem texti í modal glugga eftir að máli er lokið í ákærum.',
  },
})

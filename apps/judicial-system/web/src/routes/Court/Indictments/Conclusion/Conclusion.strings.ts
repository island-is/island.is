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
    id: 'judicial.system.core:court.indictments.conclusion.postponed',
    defaultMessage: 'Frestun',
    description: 'Notaður sem texti fyrir frestun valkost á Niðurstaða skrefi.',
  },
  postponedUntilVerdict: {
    id: 'judicial.system.core:court.indictments.conclusion.postponed_until_verdict',
    defaultMessage: 'Dómtekið',
    description:
      'Notaður sem texti fyrir dómtekið valkost á Niðurstaða skrefi.',
  },
  complete: {
    id: 'judicial.system.core:court.indictments.conclusion.complete',
    defaultMessage: 'Lokið',
    description: 'Notaður sem texti fyrir lokið valkost á Niðurstaða skrefi.',
  },
  arrangeVerdictTitle: {
    id: 'judicial.system.core:court.indictments.conclusion.arrange_verdict',
    defaultMessage: 'Dómsuppkvaðning',
    description:
      'Notaður sem texti fyrir Dómsuppkvaðning valkost á Niðurstaða skrefi.',
  },
  arrangeAnotherHearing: {
    id: 'judicial.system.core:court.indictments.conclusion.arrange_another_hearing',
    defaultMessage: 'Bóka annað þinghald',
    description:
      'Notaður sem texti fyrir bóka annað þinghald valkost á Niðurstaða skrefi.',
  },
  arrangeVerdict: {
    id: 'judicial.system.core:court.indictments.conclusion.postpone_until_verdict',
    defaultMessage: 'Boða til dómsuppkvaðningar',
    description:
      'Notaður sem texti fyrir boða til dómsuppkvaðningar valkost á Niðurstaða skrefi.',
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
  redistribute: {
    id: 'judicial.system.core:court.indictments.conclusion.redistribute_v1',
    defaultMessage: 'Fer í úthlutun til dómara',
    description:
      'Notaður sem texti fyrir Fer í úthlutun til dómara á Niðurstaða skrefi.',
  },
  decision: {
    id: 'judicial.system.core:court.indictments.conclusion.decision',
    defaultMessage: 'Lyktir',
    description: 'Notaður sem titill á lyktir hluta á Niðurstaða skrefi.',
  },
  ruling: {
    id: 'judicial.system.core:court.indictments.conclusion.ruling',
    defaultMessage: 'Dómur',
    description: 'Notaður sem texti í dómur valmöguleika á Niðurstaða skrefi.',
  },
  rulingUploadTitle: {
    id: 'judicial.system.core:court.indictments.conclusion.ruling_upload_title',
    defaultMessage: 'Dómur',
    description:
      'Notaður sem fyrirsögn fyrir Dómur upphlöðunarsvæði á Niðurstaða skrefi.',
  },
  dismissalUploadTitle: {
    id: 'judicial.system.core:court.indictments.conclusion.dismissal_upload_title',
    defaultMessage: 'Úrskurður',
    description:
      'Notaður sem fyrirsögn fyrir Úrskurður upphlöðunarsvæði á Niðurstaða skrefi.',
  },
  fine: {
    id: 'judicial.system.core:court.indictments.conclusion.fine',
    defaultMessage: 'Viðurlagaákvörðun',
    description:
      'Notaður sem texti í viðurlagaákvörðun valmöguleika á Niðurstaða skrefi.',
  },
  nextButtonTextConfirm: {
    id: 'judicial.system.core:court.indictments.conclusion.next_button_text_confirm',
    defaultMessage: 'Staðfesta',
    description: 'Notaður sem texti á halda áfram takka.',
  },
  dismissal: {
    id: 'judicial.system.core:court.indictments.conclusion.dismissal',
    defaultMessage: 'Frávísun',
    description:
      'Notaður sem texti í frávísun valmöguleika á Niðurstaða skrefi.',
  },
  cancellation: {
    id: 'judicial.system.core:court.indictments.conclusion.cancellation',
    defaultMessage: 'Niðurfelling máls',
    description:
      'Notaður sem texti í niðurfelling máls valmöguleika á Niðurstaða skrefi.',
  },
})

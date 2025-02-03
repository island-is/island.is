import { defineMessage } from 'react-intl'

export const overview = {
  heading: defineMessage({
    id: 'judicial.system.indictments:overview.heading',
    defaultMessage: 'Yfirlit ákæru',
    description: 'Notaður sem titill á yfirlit ákæru skrefi í ákærum.',
  }),
  indictmentCreated: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_created',
    defaultMessage: 'Dagsetning ákæru',
    description:
      'Notaður sem titill á "dagsetningu ákæru" hluta af yfirliti ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  prosecutor: defineMessage({
    id: 'judicial.system.indictments:overview.prosecutor',
    defaultMessage: 'Ákærandi',
    description:
      'Notaður sem titill á "ákærandi" hluta af yfirliti ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  caseType: defineMessage({
    id: 'judicial.system.indictments:overview.case_type',
    defaultMessage: 'Brot',
    description:
      'Notaður sem titill á "brot" hluta af yfirliti ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  indictmentConfirmationTitle: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_confirmation_title',
    defaultMessage: 'Afstaða staðfestingaraðila til ákæru',
    description:
      'Notaður sem titill á "Afstaða staðfestingaraðila til ákæru" hluta af yfirliti ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  confirmIndictment: defineMessage({
    id: 'judicial.system.indictments:overview.confirm_indictment',
    defaultMessage: 'Staðfesta ákæru og senda á dómstól',
    description:
      'Notaður sem texti í valmöguleika um að staðfesta ákæru á yfirliti ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  denyIndictment: defineMessage({
    id: 'judicial.system.indictments:overview.deny_indictment',
    defaultMessage: 'Hafna ákæru og endursenda til ákæranda',
    description:
      'Notaður sem texti í valmöguleika um að hafna ákæru á yfirliti ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  nextButtonText: defineMessage({
    id: 'judicial.system.indictments:overview.next_button_text_v1',
    defaultMessage:
      '{isNewIndictment, select, true {Senda} other {Endursenda}} til staðfestingar',
    description: 'Texti í áfram takka á Yfirlit ákæru skefi í ákærum.',
  }),
  caseSubmitModalTitle: defineMessage({
    id: 'judicial.system.indictments:overview.case_submit_modal_title',
    defaultMessage: 'Staðfesta ákæru',
    description: 'Titill í modal glugga á Yfirlit ákæru skefi í ákærum.',
  }),
  caseSubmitModalText: defineMessage({
    id: 'judicial.system.indictments:overview.case_submit_modal_text',
    defaultMessage: 'Ákæran verður send á dómstól ásamt skjölum og málsgögnum.',
    description: 'Texti í modal glugga á Yfirlit ákæru skefi í ákærum.',
  }),
  caseSubmitPrimaryButtonText: defineMessage({
    id: 'judicial.system.indictments:overview.case_submit_primary_button_text',
    defaultMessage: 'Staðfesta og senda á dómstól',
    description: 'Texti í takka í modal glugga á Yfirlit ákæru skefi í ákærum.',
  }),
  caseSubmitSecondaryButtonText: defineMessage({
    id: 'judicial.system.indictments:overview.case_submit_secondary_button_text',
    defaultMessage: 'Hætta við',
    description: 'Texti í takka í modal glugga á Yfirlit ákæru skefi í ákærum.',
  }),
  indictmentSentToCourt: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_sent_to_court',
    defaultMessage: 'Ákæra hefur verið send dómstól',
    description:
      'Texti í info boxi þegar ákæra hefur verið send á Yfirlit ákæru skefi í ákærum.',
  }),
  indictmentSentForConfirmationTitle: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_sent_for_confirmation_title',
    defaultMessage: 'Ákæra hefur verið send til staðfestingar',
    description:
      'Texti í info boxi þegar ákæra hefur verið send til staðfestingar á Yfirlit ákæru skefi í ákærum.',
  }),
  indictmentSentForConfirmationText: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_sent_for_confirmation_text',
    defaultMessage: 'Að staðfestingu lokinni sendist ákæran á héraðsdómstól',
    description:
      'Texti í info boxi þegar ákæra hefur verið send til staðfestingar á Yfirlit ákæru skefi í ákærum.',
  }),
  indictmentDeniedExplanationTitle: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_denied_explanation_title',
    defaultMessage: 'Ástæða höfnunar',
    description:
      'Notaður sem titill á "Hafna aðkæra" hluta af yfirliti ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  indictmentReturnedExplanationTitle: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_returned_explanation_title',
    defaultMessage: 'Ákæra endursend',
    description:
      'Notaður sem titill á "Ákæra endursend" hluta af yfirliti ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  askForCancellationButtonText: defineMessage({
    id: 'judicial.system.indictments:overview.ask_for_cancellation_button_text',
    defaultMessage: 'Afturkalla ákæru',
    description:
      'Texti á takka til að afturkalla ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  askForCancellationModalTitle: defineMessage({
    id: 'judicial.system.indictments:overview.ask_for_cancellation_modal_title',
    defaultMessage: 'Viltu afturkall ákæru?',
    description:
      'Titill í afturkalla modal glugga á Yfirlit ákæru skefi í ákærum.',
  }),
  askForCancellationModalText: defineMessage({
    id: 'judicial.system.indictments:overview.ask_for_cancellation_modal_text',
    defaultMessage:
      'Dómurinn fær tilkynningu um afturköllun ákæru ásamt verjanda hafi verjandi verið skráður.',
    description:
      'Texti í afturkalla modal glugga á Yfirlit ákæru skefi í ákærum.',
  }),
  askForCancellationPrimaryButtonText: defineMessage({
    id: 'judicial.system.indictments:overview.ask_for_cancellation_primary_button_text',
    defaultMessage: 'Afturkalla ákæru',
    description:
      'Texti í staðfesta takka í afturkalla modal glugga á Yfirlit ákæru skefi í ákærum.',
  }),
  askForCancellationSecondaryButtonText: defineMessage({
    id: 'judicial.system.indictments:overview.ask_for_cancellation_secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Texti í hætta við takka í afturkalla modal glugga á Yfirlit ákæru skefi í ákærum.',
  }),
  addDocumentsButtonText: defineMessage({
    id: 'judicial.system.indictments:overview.add_documents_button_text',
    defaultMessage: 'Bæta við gögnum',
    description:
      'Texti á takka til að bæta við skjölum á Yfirlit ákæru skefi í ákærum.',
  }),
  indictmentCancelledTitle: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_cancelled_title',
    defaultMessage: 'Mál afturkallað',
    description:
      'Texti í info boxi þegar ákæra hefur verið afturkölluð á Yfirlit ákæru skefi í ákærum.',
  }),
  indictmentCancelledMessage: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_cancelled_message',
    defaultMessage: 'Dómstóll mun ljúka máli með afturköllun.',
    description:
      'Texti í info boxi þegar ákæra hefur verið afturkölluð á Yfirlit ákæru skefi í ákærum.',
  }),
}

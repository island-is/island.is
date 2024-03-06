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
  modalHeading: defineMessage({
    id: 'judicial.system.indictments:overview.modal_heading',
    defaultMessage: 'Ákæra hefur verið send á dómstól',
    description: 'Titill í modal glugga á Yfirlit ákæru skefi í ákærum.',
  }),
  indictmentSentToCourt: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_sent_to_court',
    defaultMessage: 'Ákæra hefur verið send dómstól',
    description:
      'Texti í info boxi þegar ákæra hefur verið send á Yfirlit ákæru skefi í ákærum.',
  }),
  indictmentSentForConfirmation: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_sent_for_confirmation',
    defaultMessage: 'Ákæra hefur verið send til staðfestingar',
    description:
      'Texti í info boxi þegar ákæra hefur verið send til staðfestingar á Yfirlit ákæru skefi í ákærum.',
  }),
  indictmentSentForConfirmationText: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_sent_for_confirmation',
    defaultMessage: 'Að staðfestingu lokinni sendist ákæran á héraðsdómstól',
    description:
      'Texti í info boxi þegar ákæra hefur verið send til staðfestingar á Yfirlit ákæru skefi í ákærum.',
  }),
}

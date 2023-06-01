import { defineMessages } from 'react-intl'

export const subpoena = defineMessages({
  title: {
    id: 'judicial.system.core:subpoena.title',
    defaultMessage: 'Fyrirkall',
    description:
      'Notaður sem titill á síðu á Fyrirkall skrefi í dómaraflæði í ákærum.',
  },
  courtArrangementsHeading: {
    id: 'judicial.system.core:subpoena.court_arrangements_heading',
    defaultMessage: 'Staður og stund þingfestingar',
    description:
      'Notaður sem titill fyrir Staður og stund þingfestingar hluta á Fyrirkalls skjá í dómaraflæði í ákærum.',
  },
  nextButtonText: {
    id: 'judicial.system.core:subpoena.next_button_text',
    defaultMessage: 'Staðfesta og senda boðun',
    description:
      'Notaður sem texti í áfram takka á Fyrirkall skrefi í dómaraflæði í ákærum.',
  },
  modalTitle: {
    id: 'judicial.system.core:subpoena.modal_title_v2',
    defaultMessage:
      'Viltu senda sækjanda {courtDateHasChanged, select, true {nýtt } other {}}boð í þingfestingu?',
    description: 'Notaður sem titill í modal glugga á Fyrirkallsskjá í ákærum.',
  },
  modalPrimaryButtonText: {
    id: 'judicial.system.core:subpoena.modal_primary_button_text',
    defaultMessage: 'Senda boð',
    description:
      'Notaður sem texti í staðfesta takka í modal glugga á Fyrirkallsskjá í ákærum.',
  },
})

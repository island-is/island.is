import { defineMessages } from 'react-intl'

export const subpoena = {
  ...defineMessages({
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
    subpoenaTypeTitle: {
      id: 'judicial.system.core:subpoena.subpoena_type_title',
      defaultMessage: 'Tegund fyrirkalls',
      description:
        'Notaður sem titill fyrir Tegund fyrirkalls hluta á Fyrirkalls skjá í dómaraflæði í ákærum.',
    },
    subpoenaTypeAbsence: {
      id: 'judicial.system.core:subpoena.subpoena_type_absence',
      defaultMessage: 'Útivistarfyrirkall',
      description:
        'Notaður sem texti fyrir Útivistarfyrirkall valkost á Fyrirkalls skjá í dómaraflæði í ákærum.',
    },
    subpoenaTypeArrest: {
      id: 'judicial.system.core:subpoena.subpoena_type_arrest',
      defaultMessage: 'Handtökufyrirkall',
      description:
        'Notaður sem texti fyrir Handtökufyrirkall valkost á Fyrirkalls skjá í dómaraflæði í ákærum.',
    },
    newSubpoenaButtonText: {
      id: 'judicial.system.core:subpoena.new_subpoena_button_text',
      defaultMessage: 'Nýtt fyrirkall',
      description:
        'Notaður sem texti á takka sem býður notanda að búa til nýtt fyrirkall.',
    },
    modalTitle: {
      id: 'judicial.system.core:subpoena.modal_title_v3',
      defaultMessage: 'Viltu senda fyrirkall?',
      description:
        'Notaður sem titill í modal glugga á Fyrirkallsskjá í ákærum.',
    },
    modalText: {
      id: 'judicial.system.core:subpoena.modal_message',
      defaultMessage:
        'Ákæra og fyrirkall verða send til ákæranda.\nÁkærða verður birt ákæran og fyrirkallið rafrænt á island.is',
      description:
        'Notað sem skilaboð í modal glugga á Fyrirkallsskjá í ákærum',
    },
    modalPrimaryButtonText: {
      id: 'judicial.system.core:subpoena.modal_primary_button_text_v2',
      defaultMessage: 'Já, senda núna',
      description:
        'Notaður sem texti í staðfesta takka í modal glugga á Fyrirkallsskjá í ákærum.',
    },
    modalSecondaryButtonText: {
      id: 'judicial.system.core:subpoena.modal_secondary_button_text',
      defaultMessage: 'Hætta við',
      description:
        'Notaður sem texti í hætta takka í modal glugga á Fyrirkallsskjá í ákærum.',
    },
  }),
  modalAlternativeServiceTitle: 'Skrá birtingu með öðrum hætti',
  modalAlternativeServiceText:
    'Málið fer á dagskrá og aðilar máls fá boð í þingfestingu.',
  modalAlternativeServicePrimaryButtonText: 'Halda áfram',
}

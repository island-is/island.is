import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  htmlTitle: {
    id: 'judicial.system.core:court_of_appeal.summary.html_title',
    defaultMessage: 'Samantekt - Réttarvörslugátt',
    description: 'Notaður sem titill síðu í vafra',
  },
  alertBannerTitle: {
    id: 'judicial.system.core:court_of_appeal.summary.alert_banner_title',
    defaultMessage: 'Niðurstaða Landsréttar',
    description: 'Titill á niðurstöðu landsréttar á samantektarsíðu',
  },
  title: {
    id: 'judicial.system.core:court_of_appeal.summary.title',
    defaultMessage: 'Samantekt',
    description: 'Notaður sem titill fyrir samantektarsíðu',
  },
  nextButtonFooter: {
    id: 'judicial.system.core:court_of_appeal.summary.next_button_footer',
    defaultMessage: 'Ljúka máli',
    description:
      'Notaður sem titill á ljúka máli takka á úrskurðin Landsrétta.',
  },
  uploadCompletedModalTitle: {
    id: 'judicial.system.core:court_of_appeal.summary.upload_completed_modal_title',
    defaultMessage: 'Máli hefur verið lokið',
    description:
      'Notaður sem titill á loka máli modal á skrefi samantektar Landsréttar.',
  },
  uploadCompletedModalText: {
    id: 'judicial.system.core:court_of_appeal.summary.upload_completed_modal_text',
    defaultMessage:
      'Tilkynning um úrskurð Landsréttar hefur verið send á aðila máls, héraðsdóm og fangelsi ef við á',
    description:
      'Notaður sem texti í loka máli modal á skrefi samantektar Landsréttar.',
  },
})

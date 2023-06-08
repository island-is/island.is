import { defineMessages } from 'react-intl'

export const courtOfAppealRuling = defineMessages({
  title: {
    id: 'judicial.system.core:court_of_appeal_ruling.title',
    defaultMessage: 'Úrskurður',
    description: 'Titill á úrskurðar skrefi afgreiddra mála hjá Landsrétti',
  },
  caseNumber: {
    id: 'judicial.system.core:court_of_appeal_ruling.caseNumber',
    defaultMessage: 'Mál nr. {caseNumber}',
    description: 'Notað fyrir texta fyrir númer á máli',
  },
  courtOfAppealCaseNumber: {
    id: 'judicial.system.core:court_of_appeal_ruling.courtOfAppealCaseNumber',
    defaultMessage: 'Málsnr. Héraðsdóms {caseNumber}',
    description: 'Notað fyrir texta fyrir númer á Héraðsdóm máli',
  },
  decision: {
    id: 'judicial.system.core:court_of_appeal_ruling.decision',
    defaultMessage: 'Lyktir',
    description:
      'Notaður sem titill fyrir "Úrskurður" hlutann á úrskurðar skrefi í Landsrétti.',
  },
  conclusionHeading: {
    id: 'judicial.system.core:court_of_appeal_ruling.conclusionHeading',
    defaultMessage: 'Úrskurðarorð',
    description: 'Notaður sem fyrirsögn á úrskurðarorð.',
  },
  courtConclusionHeading: {
    id: 'judicial.system.core:court_of_appeal_ruling.courtConclusionHeading',
    defaultMessage: 'Úrskurður Landsréttar',
    description: 'Notaður sem fyrirsögn á úrskurður Landsréttar.',
  },
  nextButtonFooter: {
    id: 'judicial.system.core:court_of_appeal_ruling.nextButtonFooter',
    defaultMessage: 'Ljúka máli',
    description:
      'Notaður sem titill á ljúka máli takka á úrskurðin Landsrétta.',
  },
  inputFieldLabel: {
    id: 'judicial.system.core:court_of_appeal_ruling.input_field_label',
    defaultMessage: 'Dragðu gögn hingað til að hlaða upp',
    description:
      'Notaður sem titill á hlaða upp gögnum á skrefi úrskurður Landsréttar.',
  },
  uploadButtonText: {
    id: 'judicial.system.core:court_of_appeal_ruling.upload_button_text',
    defaultMessage: 'Velja gögn til að hlaða upp',
    description:
      'Notaður sem titill á hlaða upp takka á skrefi úrskurður Landsréttar.',
  },
  uploadCompletedModalTitle: {
    id: 'judicial.system.core:court_of_appeal_ruling.upload_completed_modal_title',
    defaultMessage: 'Máli hefur verið lokið',
    description:
      'Notaður sem titill á loka máli modal á skrefi úrskurður Landsréttar.',
  },
  uploadCompletedModalText: {
    id: 'judicial.system.core:court_of_appeal_ruling.upload_completed_modal_text',
    defaultMessage:
      'Tilkynning um úrskurð Landsréttar hefur verið send á aðila máls, héraðsdóm og fangelsi ef við á',
    description:
      'Notaður sem texti í loka máli modal á skrefi úrskurður Landsréttar.',
  },
})

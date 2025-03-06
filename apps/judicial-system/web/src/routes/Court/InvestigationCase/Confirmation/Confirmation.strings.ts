import { defineMessages } from 'react-intl'

export const confirmation = defineMessages({
  title: {
    id: 'judicial.system.core:investigation_case_confirmation.title',
    defaultMessage: 'Samantekt',
    description: 'Notaður sem titill á úrskurðar skrefi í rannsóknarheimildum.',
  },
  conclusionTitle: {
    id: 'judicial.system.core:investigation_case_confirmation.conclusion_title',
    defaultMessage: 'Úrskurðarorð',
    description:
      'Notaður sem titill fyrir "Úrskurðarorð" hlutanum á úrskurðar skrefi í rannsóknarheimildum.',
  },
  continueButtonTextAccepting: {
    id: 'judicial.system.core:investigation_case_confirmation.continue_button_text_accepting',
    defaultMessage: 'Samþykkja kröfu og undirrita úrskurð',
    description:
      'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að samþykkja kröfu',
  },
  continueButtonTextCompletedWithoutRuling: {
    id: 'judicial.system.core:investigation_case_confirmation.continue_button_text_completed_without_ruling',
    defaultMessage: 'Ljúka máli án úrskurðar',
    description:
      'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að ljúka máli án úrskurðar',
  },
  continueButtonTextAcceptingPartially: {
    id: 'judicial.system.core:investigation_case_confirmation.continue_button_text_accepting_partially',
    defaultMessage: 'Staðfesta og undirrita úrskurð',
    description:
      'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að samþykkja kröfu að hluta',
  },
  continueButtonTextRejecting: {
    id: 'judicial.system.core:investigation_case_confirmation.continue_button_text_rejecting',
    defaultMessage: 'Hafna kröfu og undirrita úrskurð',
    description:
      'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að hafna kröfu',
  },
  continueButtonTextDismissing: {
    id: 'judicial.system.core:investigation_case_confirmation.continue_button_text_dismissing',
    defaultMessage: 'Vísa kröfu frá og undirrita úrskurð',
    description:
      'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að vísa kröfu frá',
  },
  onlyAssigendJudgeCanSign: {
    id: 'judicial.system.core:investigation_case_confirmation.only_assigend_judge_can_sign',
    defaultMessage: 'Einungis skráður dómari getur undirritað úrskurð',
    description:
      'Notaður sem texti í stað "áfram" takkans á staðfesingar skrefi í rannsóknarheimildum þegar "áfram" takkinn er falinn',
  },
})

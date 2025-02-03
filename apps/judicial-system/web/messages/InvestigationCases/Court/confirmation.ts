// TODO: Delete this file
import { defineMessages } from 'react-intl'

export const icConfirmation = {
  sections: {
    conclusion: defineMessages({
      title: {
        id: 'judicial.system.investigation_cases:confirmation.conclusion.title',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" hlutanum á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
  },
  footer: {
    accepting: defineMessages({
      continueButtonText: {
        id: 'judicial.system.investigation_cases:confirmation.footer.accepting.continue_button_text',
        defaultMessage: 'Samþykkja kröfu og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að samþykkja kröfu',
      },
      continueWithoutRulingButtonText: {
        id: 'judicial.system.investigation_cases:confirmation.footer.accepting.continue_without_ruling_button_text',
        defaultMessage: 'Ljúka máli án úrskurðar',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að ljúka máli án úrskurðar',
      },
    }),
    rejecting: defineMessages({
      continueButtonText: {
        id: 'judicial.system.investigation_cases:confirmation.footer.rejecting.continue_button_text',
        defaultMessage: 'Hafna kröfu og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að hafna kröfu',
      },
    }),
    dismissing: defineMessages({
      continueButtonText: {
        id: 'judicial.system.investigation_cases:confirmation.footer.dismissing.continue_button_text',
        defaultMessage: 'Vísa kröfu frá og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að vísa kröfu frá',
      },
    }),
    acceptingPartially: defineMessages({
      continueButtonText: {
        id: 'judicial.system.investigation_cases:confirmation.footer.accepting_partially.continue_button_text',
        defaultMessage: 'Staðfesta og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að samþykkja kröfu að hluta',
      },
    }),
  },
}

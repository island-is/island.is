// TODO: Delete this file
import { defineMessages } from 'react-intl'

export const rcConfirmation = {
  sections: {
    conclusion: defineMessages({
      title: {
        id: 'judicial.system.restriction_cases:confirmation.conclusion.title',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" hlutanum á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
  footer: {
    accepting: defineMessages({
      continueButtonText: {
        id: 'judicial.system.restriction_cases:confirmation.footer.accepting.continue_button_text',
        defaultMessage: 'Samþykkja kröfu og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í gæslu- og farbannsmálum þegar verið er að samþykkja kröfu',
      },
    }),
    acceptingPartially: defineMessages({
      continueButtonText: {
        id: 'judicial.system.restriction_cases:confirmation.footer.accepting_partially.continue_button_text',
        defaultMessage: 'Staðfesta og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í gæslu- og farbannsmálum þegar verið er að samþykkja kröfu að hluta',
      },
    }),
    rejecting: defineMessages({
      continueButtonText: {
        id: 'judicial.system.restriction_cases:confirmation.footer.rejecting.continue_button_text',
        defaultMessage: 'Hafna kröfu og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í gæslu- og farbannsmálum þegar verið er að hafna kröfu',
      },
    }),
    dismissing: defineMessages({
      continueButtonText: {
        id: 'judicial.system.restriction_cases:confirmation.footer.dismissing.continue_button_text',
        defaultMessage: 'Vísa kröfu frá og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í gæslu- og farbannsmálum þegar verið er að vísa kröfu frá',
      },
    }),
    acceptingAlternativeTravelBan: defineMessages({
      continueButtonText: {
        id: 'judicial.system.restriction_cases:confirmation.footer.accepting_alternative_travel_ban.continue_button_text',
        defaultMessage: 'Staðfesta farbann og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í gæslu- og farbannsmálum þegar verið er að hafna kröfu en úrskurða í farbann',
      },
    }),
  },
}

import { defineMessages } from 'react-intl'

export const icConfirmation = {
  sections: {
    accusedAppealDecision: defineMessages({
      disclaimer: {
        id:
          'judicial.system.investigation_cases:confirmation.accused_appeal_decision.disclaimer',
        defaultMessage:
          'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
        description:
          'Notaður sem texti í "Ákvörðun um kæru" hlutanum á yfirliti úrskurðar skrefi í rannsóknarheimildum',
      },
    }),
  },
  modal: defineMessages({
    text: {
      id:
        'judicial.system.investigation_cases:confirmation.modal.text#markdown',
      defaultMessage:
        'Úrskurður hefur verið sendur á ákæranda, dómritara og dómara sem kvað upp úrskurð. Úrskurðir eru eingöngu sendir á verjanda eða talsmann varnaraðila séu þeir viðstaddir þinghald.<br/><br/>Þú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
      description:
        'Notaður sem texti í úrskurðar tilkynningaglugganum á staðfesingar skrefi í rannsóknarheimildum',
    },
  }),
  footer: {
    accepting: defineMessages({
      continueButtonText: {
        id:
          'judicial.system.investigation_cases:confirmation.footer.accepting.continue_button_text',
        defaultMessage: 'Samþykkja kröfu og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að samþykkja kröfu',
      },
    }),
    rejecting: defineMessages({
      continueButtonText: {
        id:
          'judicial.system.investigation_cases:confirmation.footer.rejecting.continue_button_text',
        defaultMessage: 'Hafna kröfu og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að hafna kröfu',
      },
    }),
    dismissing: defineMessages({
      continueButtonText: {
        id:
          'judicial.system.investigation_cases:confirmation.footer.dismissing.continue_button_text',
        defaultMessage: 'Vísa kröfu frá og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að vísa kröfu frá',
      },
    }),
    acceptingPartially: defineMessages({
      continueButtonText: {
        id:
          'judicial.system.investigation_cases:confirmation.footer.accepting_partially.continue_button_text',
        defaultMessage: 'Staðfesta og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í rannsóknarheimildum þegar verið er að samþykkja kröfu að hluta',
      },
    }),
  },
}

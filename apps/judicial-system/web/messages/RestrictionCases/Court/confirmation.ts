import { defineMessages } from 'react-intl'

export const rcConfirmation = {
  sections: {
    custodyRestrictions: defineMessages({
      disclaimer: {
        id:
          'judicial.system.restriction_cases:confirmation.custody_restrictions.disclaimer',
        defaultMessage:
          'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd {caseType} undir dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um lagarök" titlinn á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    conclusion: defineMessages({
      title: {
        id: 'judicial.system.restriction_cases:confirmation.conclusion.title',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" hlutanum á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
  modal: {
    custodyCases: defineMessages({
      text: {
        id:
          'judicial.system.restriction_cases:confirmation.modal.custody_cases.text#markdown',
        defaultMessage:
          'Úrskurður hefur verið sendur á ákæranda, verjanda og dómara sem kvað upp úrskurð. Auk þess hefur útdráttur verið sendur á fangelsi.<br/><br/>Þú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
        description:
          'Notaður sem texti í úrskurðar tilkynningaglugganum á staðfesingar skrefi í gæsluvarðhaldsmálum.',
      },
    }),
    travelBanCases: defineMessages({
      text: {
        id:
          'judicial.system.restriction_cases:confirmation.modal.travel_ban_cases.text#markdown',
        defaultMessage:
          'Úrskurður hefur verið sendur á ákæranda, verjanda og dómara sem kvað upp úrskurð.<br/><br/>Þú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
        description:
          'Notaður sem texti í úrskurðar tilkynningaglugganum á staðfesingar skrefi í farbannsmálum.',
      },
    }),
  },
  footer: {
    accepting: defineMessages({
      continueButtonText: {
        id:
          'judicial.system.restriction_cases:confirmation.footer.accepting.continue_button_text',
        defaultMessage: 'Samþykkja kröfu og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í gæslu- og farbannsmálum þegar verið er að samþykkja kröfu',
      },
    }),
    rejecting: defineMessages({
      continueButtonText: {
        id:
          'judicial.system.restriction_cases:confirmation.footer.rejecting.continue_button_text',
        defaultMessage: 'Hafna kröfu og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í gæslu- og farbannsmálum þegar verið er að hafna kröfu',
      },
    }),
    dismissing: defineMessages({
      continueButtonText: {
        id:
          'judicial.system.restriction_cases:confirmation.footer.dismissing.continue_button_text',
        defaultMessage: 'Vísa kröfu frá og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í gæslu- og farbannsmálum þegar verið er að vísa kröfu frá',
      },
    }),
    acceptingAlternativeTravelBan: defineMessages({
      continueButtonText: {
        id:
          'judicial.system.restriction_cases:confirmation.footer.accepting_alternative_travel_ban.continue_button_text',
        defaultMessage: 'Staðfesta farbann og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í gæslu- og farbannsmálum þegar verið er að hafna kröfu en úrskurða í farbann',
      },
    }),
  },
}

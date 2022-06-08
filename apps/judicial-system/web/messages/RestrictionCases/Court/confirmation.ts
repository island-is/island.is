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
    seenByDefenderAlert: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:confirmation.sections.seen_by_defender_alert.title',
        defaultMessage: 'Krafa sótt af verjanda',
        description:
          'Notaður sem titill fyrir "Krafa sótt af verjanda" hluta á yfirlitssíðu í gæsluvarðhalds- og farbannsmálum.',
      },
      text: {
        id:
          'judicial.system.restriction_cases:confirmation.sections.seen_by_defender_alert.text',
        defaultMessage:
          'Verjandi skráði sig inn til að sækja kröfuskjal {when}.',
        description:
          'Notaður sem titill fyrir "Krafa sótt af verjanda" hluta á yfirlitssíðu í gæsluvarðhalds- og farbannsmálum.',
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
    rulingNotification: defineMessages({
      text: {
        id:
          'judicial.system.restriction_cases:confirmation.modal.ruling_notification.text#markdown',
        defaultMessage:
          'Úrskurður hefur verið sendur á ákæranda, verjanda og dómara sem kvað upp úrskurð.{summarySentToPrison, select, yes { Auk þess hefur útdráttur verið sendur á fangelsi.} other {}}<br/><br/>Þú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
        description:
          'Notaður sem texti í úrskurðar tilkynningaglugganum á staðfesingar skrefi í gæslu-, farbanns- og vistunarmálum.',
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
    acceptingPartially: defineMessages({
      continueButtonText: {
        id:
          'judicial.system.restriction_cases:confirmation.footer.accepting_partially.continue_button_text',
        defaultMessage: 'Staðfesta og undirrita úrskurð',
        description:
          'Notaður sem texti í "áfram" takkanum á staðfesingar skrefi í gæslu- og farbannsmálum þegar verið er að samþykkja kröfu að hluta',
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

import { defineMessages } from 'react-intl'

export const rcConfirmation = {
  sections: {
    accusedAppealDecision: defineMessages({
      disclaimer: {
        id:
          'judicial.system.restriction_cases:confirmation.accused_appeal_decision.disclaimer',
        defaultMessage:
          'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
        description:
          'Notaður sem texti í "Ákvörðun um kæru" hlutanum á yfirliti úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    custodyRestrictions: defineMessages({
      disclaimer: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.custody_restrictions.disclaimer',
        defaultMessage:
          'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd {caseType} undir dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um lagarök" titlinn á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
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
}

import { defineMessage, defineMessages } from 'react-intl'

export const rcRulingStepTwo = {
  title: defineMessage({
    id: 'judicial.system.restriction_cases:ruling_step_two.title',
    defaultMessage: 'Úrskurður og kæra',
    description:
      'Notaður sem titill á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    conclusion: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.conclusion.title',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" hlutann á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.conclusion.label',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" innsláttarsvæði á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.conclusion.placeholder',
        defaultMessage: 'Hver eru úrskurðarorðin',
        description:
          'Notaður sem placeholder fyrir "Úrskurðarorð" innsláttarsvæði á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      dismissingAutofill: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.conclusion.dismissing_autofill',
        defaultMessage:
          'Kröfu um að {genderedAccused}, {accusedName}, sæti{extensionSuffix} {caseType} er vísað frá.',
        description:
          'Notaður sem sjálfgefinn texti í "Úrskurðarorð" textaboxi þegar kröfu er vísað frá á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      rejectingAutofill: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.conclusion.rejecting_autofill',
        defaultMessage:
          'Kröfu um að {genderedAccused}, {accusedName}, kt. {accusedNationalId}, sæti{extensionSuffix} {caseType} er hafnað.',
        description:
          'Notaður sem sjálfgefinn texti í "Úrskurðarorð" textaboxi þegar kröfu er hafnað á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      acceptingAutofill: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.conclusion.accepting_autofill',
        defaultMessage:
          '{genderedAccused}, {accusedName}, kt. {accusedNationalId}, skal sæta {caseTypeAndExtensionSuffix}, þó ekki lengur en til {validToDate}.{isolationSuffix}',
        description:
          'Notaður sem sjálfgefinn texti í "Úrskurðarorð" textaboxi þegar krafa er samþykkt á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    appealDecision: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.title',
        defaultMessage: 'Ákvörðun um kæru',
        description:
          'Notaður sem titill fyrir "Ákvörðun um kæru" hlutann á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      disclaimer: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.disclaimer',
        defaultMessage:
          'Dómari kynnir rétt til að kæra úrskurð og um kærufrest skv. 193. gr. laga nr. 88/2008.',
        description:
          'Notaður sem texti í "Ákvörðun um kæru" hlutanum á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedTitle: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.accused_title',
        defaultMessage: 'Afstaða {accused} til málsins í lok þinghalds',
        description:
          'Notaður sem titill fyrir "Afstaða kærða til málsins í lok þinghalds" spjald á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedAppeal: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.accused_appeal',
        defaultMessage: '{accused} kærir úrskurðinn',
        description:
          'Notaður sem texti við valmöguleika kærða um að kæra úrskurðinn radio takkann á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedAccept: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.accused_accept',
        defaultMessage: '{accused} unir úrskurðinum',
        description:
          'Notaður sem texti við valmöguleika kærða um að una úrskurðinum radio takkann á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedPostpone: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.accused_postpone',
        defaultMessage: '{accused} tekur sér lögboðinn frest',
        description:
          'Notaður sem texti við valmöguleika kærða um lögbundinn frest radio takkann á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedNotApplicable: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.accused_not_applicable',
        defaultMessage: 'Á ekki við',
        description:
          'Notaður sem texti við valmöguleika kærða um á ekki við radio takkann á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedAnnouncementLabel: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.accused_announcement_label',
        defaultMessage: 'Yfirlýsing {accused}',
        description:
          'Notaður sem titill á "Yfirlýsing kærða" innsláttarsvæði á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      accusedAnnouncementPlaceholder: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.accused_announcement_placeholder',
        defaultMessage:
          'Hér er hægt að bóka frekar um það sem {accused} vill taka fram ef við á.',
        description:
          'Notaður sem placeholder í "Yfirlýsing kærða" innsláttarsvæði á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorTitle: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.prosecutor_title',
        defaultMessage: 'Afstaða sækjanda til málsins í lok þinghalds',
        description:
          'Notaður sem titill fyrir "Afstaða sækjanda til málsins í lok þinghalds" spjald á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorAppeal: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.prosecutor_appeal',
        defaultMessage: 'Sækjandi kærir úrskurðinn',
        description:
          'Notaður sem texti við valmöguleika sækjanda um að kæra úrskurðinn radio takkann á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorAccept: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.prosecutor_accept',
        defaultMessage: 'Sækjandi unir úrskurðinum',
        description:
          'Notaður sem texti við valmöguleika sækjanda um að una úrskurðinum radio takkann á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorPostpone: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.prosecutor_postpone',
        defaultMessage: 'Sækjandi tekur sér lögboðinn frest',
        description:
          'Notaður sem texti við valmöguleika sækjanda um lögbundinn frest radio takkann á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorNotApplicable: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.prosecutor_not_applicable',
        defaultMessage: 'Á ekki við',
        description:
          'Notaður sem texti við valmöguleika sækjanda um á ekki við radio takkann á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorAnnouncementLabel: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.prosecutor_announcement_label',
        defaultMessage: 'Yfirlýsing sækjanda',
        description:
          'Notaður sem titill á "Yfirlýsing sækjanda" innsláttarsvæði á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      prosecutorAnnouncementPlaceholder: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.prosecutor_announcement_placeholder',
        defaultMessage:
          'Hér er hægt að bóka frekar um það sem sækjandi vill taka fram ef við á.',
        description:
          'Notaður sem placeholder í "Yfirlýsing sækjanda" innsláttarsvæði á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
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
}

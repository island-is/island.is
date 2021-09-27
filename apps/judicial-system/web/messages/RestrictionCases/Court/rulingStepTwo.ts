import { defineMessages } from 'react-intl'

export const rcRulingStepTwo = {
  sections: {
    conclusion: defineMessages({
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
    accusedAppealDecision: defineMessages({
      disclaimer: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.accused_appeal_decision.disclaimer',
        defaultMessage:
          'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
        description:
          'Notaður sem texti í "Ákvörðun um kæru" hlutanum á úrskurðar og kæru skrefi í gæsluvarðhalds- og farbannsmálum.',
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

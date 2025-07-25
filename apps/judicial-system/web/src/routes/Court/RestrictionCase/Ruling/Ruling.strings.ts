import { defineMessage, defineMessages } from 'react-intl'

export const strings = {
  title: defineMessage({
    id: 'judicial.system.core:restriction_cases.ruling.title',
    defaultMessage: 'Úrskurður',
    description:
      'Notaður sem titill á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    conclusion: defineMessages({
      dismissingAutofill: {
        id: 'judicial.system.core:restriction_cases.ruling.conclusion.dismissing_autofill',
        defaultMessage:
          'Kröfu um að varnaraðili, {defendantName}, sæti{isExtended, select, true { áframhaldandi} other {}} {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} TRAVEL_BAN {farbanni} other {gæsluvarðhaldi}} er vísað frá.',
        description:
          'Notaður sem sjálfgefinn texti í "Úrskurðarorð" textaboxi þegar kröfu er vísað frá á úrskurðar skrefi í gæsluvarðhalds-, vistunar- og farbannsmálum.',
      },
      rejectingAutofill: {
        id: 'judicial.system.core:restriction_cases.ruling.conclusion.rejecting_autofill',
        defaultMessage:
          'Kröfu um að varnaraðili, {defendantName}{defendantDOB}sæti{isExtended, select, true { áframhaldandi} other {}} {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} TRAVEL_BAN {farbanni} other {gæsluvarðhaldi}} er hafnað.',
        description:
          'Notaður sem sjálfgefinn texti í "Úrskurðarorð" textaboxi þegar kröfu er hafnað á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      acceptingAutofill: {
        id: 'judicial.system.core:restriction_cases.ruling.conclusion.accepting_autofill',
        defaultMessage:
          'Varnaraðili, {defendantName}{defendantDOB}skal sæta {isExtended, select, true {áframhaldandi } other {}}{caseType, select, TRAVEL_BAN {farbanni} ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} other {gæsluvarðhaldi}}, þó ekki lengur en til {validToDate}.{hasIsolation, select, true { Varnaraðili skal sæta einangrun {isolationEndsBeforeValidToDate, select, true {ekki lengur en til {isolationToDate}} other {á meðan á {caseType, select, ADMISSION_TO_FACILITY {vistunni} other {gæsluvarðhaldinu}} stendur}}.} other {}}',
        description:
          'Notaður sem sjálfgefinn texti í "Úrskurðarorð" textaboxi þegar krafa er samþykkt á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      title: {
        id: 'judicial.system.core:restriction_cases.ruling.conclusion.title',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.core:restriction_cases.ruling.conclusion.label',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" innsláttarsvæði á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id: 'judicial.system.core:restriction_cases.ruling.conclusion.placeholder',
        defaultMessage:
          'Tillaga að úrskurðarorðum forbókast hér þegar lyktir máls eru valdar',
        description:
          'Notaður sem placeholder fyrir "Úrskurðarorð" innsláttarsvæði á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    courtCaseFacts: defineMessages({
      title: {
        id: 'judicial.system.core:restriction_cases.ruling.court_case_facts.title',
        defaultMessage: 'Málsatvik',
        description:
          'Notaður sem titill fyrir "greinargerð um málsatvik" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id: 'judicial.system.core:restriction_cases.ruling.court_case_facts.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um málsatvik" titlinn á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.core:restriction_cases.ruling.court_case_facts.label',
        defaultMessage: 'Greinargerð um málsatvik',
        description:
          'Notaður sem titill fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id: 'judicial.system.core:restriction_cases.ruling.court_case_facts.placeholder',
        defaultMessage:
          'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
        description:
          'Notaður sem skýritexti fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum..',
      },
    }),
    courtLegalArguments: defineMessages({
      title: {
        id: 'judicial.system.core:restriction_cases.ruling.court_legal_arguments.title',
        defaultMessage: 'Lagarök',
        description:
          'Notaður sem titill fyrir "Greinargerð um lagarök" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id: 'judicial.system.core:restriction_cases.ruling.court_legal_arguments.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um lagarök" titlinn á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.core:restriction_cases.ruling.court_legal_arguments.label',
        defaultMessage: 'Greinargerð um lagarök',
        description:
          'Notaður sem titill fyrir "Lagarök" innsláttarsvæðið á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id: 'judicial.system.core:restriction_cases.ruling.court_legal_arguments.placeholder',
        defaultMessage:
          'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
        description:
          'Notaður sem skýritexti fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    decision: defineMessages({
      title: {
        id: 'judicial.system.core:restriction_cases.ruling.decision.title',
        defaultMessage: 'Lyktir máls',
        description:
          'Notaður sem titill fyrir "Úrskurður" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    introduction: defineMessages({
      autofill: {
        id: 'judicial.system.core:restriction_cases.ruling.introduction.autofill',
        defaultMessage: 'Mál þetta var þingfest og tekið til úrskurðar {date}.',
        description:
          'Notaður sem sjálfgefinn texti í "Aðfararorð" textabox á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      title: {
        id: 'judicial.system.core:restriction_cases.ruling.sections.introduction.title',
        defaultMessage: 'Aðfararorð',
        description:
          'Titill sem titill fyrir "Aðfararorð" hlutann í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.core:restriction_cases.ruling.introduction.label',
        defaultMessage: 'Aðfararorð',
        description:
          'Notaður sem titill fyrir í "Aðfararorð" textaboxi á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id: 'judicial.system.core:restriction_cases.ruling.introduction.placeholder',
        defaultMessage:
          'Hér er m.a. unnt að greina frá því hvaða dag krafa var tekin fyrir og/eða tekin til úrskurðar.',
        description:
          'Notaður sem skýritexti fyrir í "Aðfararorð" textabox á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    prosecutorDemands: defineMessages({
      title: {
        id: 'judicial.system.core:restriction_cases.ruling.prosecutor_demands.title',
        defaultMessage: 'Dómkröfur',
        description:
          'Notaður sem titill fyrir "dómkröfur" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.core:restriction_cases.ruling.prosecutor_demands.label',
        defaultMessage: 'Dómkröfur',
        description:
          'Notaður sem titill fyrir í "Krafa lögreglu" textaboxi á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id: 'judicial.system.core:restriction_cases.ruling.prosecutor_demands.placeholder',
        defaultMessage: 'Hvað hafði ákæruvaldið að segja?',
        description:
          'Notaður sem skýritexti fyrir í "Hvað hafði ákæruvaldið að segja?" textabox á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    ruling: defineMessages({
      title: {
        id: 'judicial.system.core:restriction_cases.ruling.ruling.title',
        defaultMessage: 'Niðurstaða',
        description:
          'Notaður sem titill fyrir "Niðurstaða" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}

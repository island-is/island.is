import { defineMessage, defineMessages } from 'react-intl'

// Strings for report form 'Greinargerð'
export const rcReportForm = {
  heading: defineMessage({
    id: 'judicial.system.restriction_cases:report_form.heading',
    defaultMessage: 'Greinargerð',
    description:
      'Notaður sem titill á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    demands: defineMessages({
      heading: {
        id: 'judicial.system.restriction_cases:report_form.demands.heading',
        defaultMessage: 'Dómkröfutexti',
        description:
          'Notaður sem titill fyrir "dómkröfutexti" hlutann á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id: 'judicial.system.restriction_cases:report_form.demands.tooltip',
        defaultMessage:
          'Hér er hægt að bæta texta við dómkröfur, t.d. ef óskað er eftir öðrum úrræðum til vara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómkröfutexti" titlinn á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.restriction_cases:report_form.demands.label',
        defaultMessage: 'Dómkröfur',
        description:
          'Notaður sem titill í textaboxi fyrir "dómkröfur" á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofill: {
        id: 'judicial.system.restriction_cases:report_form.demands.autofill_v4',
        defaultMessage:
          'Þess er krafist að {defendantName}{defendantDOB}sæti{isExtended, select, true { áframhaldandi} other {}} {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} TRAVEL_BAN {farbanni} other {gæsluvarðhaldi}} með úrskurði {court}, til {requestedValidToDate}{hasIsolationRequest, select, true {, og verði gert að sæta einangrun á meðan á varðhaldi stendur} other {}}.',
        description:
          'Notaður sem sjálfgefinn texti í textaboxi fyrir "dómkröfur" á greinargerðar skrefi í gæsluvarðhalds-, vistunar- og farbannsmálum.',
      },
    }),
    caseFacts: defineMessages({
      heading: {
        id: 'judicial.system.restriction_cases:report_form.case_facts.heading',
        defaultMessage: 'Greinargerð um málsatvik',
        description:
          'Notaður sem titill fyrir "málsatvik" hlutann á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id: 'judicial.system.restriction_cases:report_form.case_facts.tooltip',
        defaultMessage:
          'Málsatvik, hvernig meðferð þessa máls hófst, skal skrá hér ásamt framburðum vitna og sakborninga ef til eru. Einnig er gott að taka fram stöðu rannsóknar og næstu skref.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "málsatvik" titlinn á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.restriction_cases:report_form.case_facts.label',
        defaultMessage: 'Málsatvik',
        description:
          'Notaður sem titill í textaboxi fyrir "málsatvik" á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id: 'judicial.system.restriction_cases:report_form.case_facts.placeholder',
        defaultMessage:
          'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
        description:
          'Notaður sem skýritexti í textaboxi fyrir "málsatvik" á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    legalArguments: defineMessages({
      heading: {
        id: 'judicial.system.restriction_cases:report_form.legal_arguments.heading',
        defaultMessage: 'Greinargerð um lagarök',
        description:
          'Notaður sem titill fyrir "lagarök" hlutann á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id: 'judicial.system.restriction_cases:report_form.legal_arguments.tooltip',
        defaultMessage:
          'Lagarök og lagaákvæði sem eiga við brotið og kröfuna skal taka fram hér.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "lagarök" titlinn á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.restriction_cases:report_form.legal_arguments.label',
        defaultMessage: 'Lagarök',
        description:
          'Notaður sem titill í textaboxi fyrir "lagarök" á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id: 'judicial.system.restriction_cases:report_form.legal_arguments.placeholder',
        defaultMessage: 'Hver eru lagarökin fyrir kröfu um gæsluvarðhald?',
        description:
          'Notaður sem skýritexti í textaboxi fyrir "lagarök" á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}

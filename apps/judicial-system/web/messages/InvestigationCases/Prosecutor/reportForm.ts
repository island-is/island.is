import { defineMessage, defineMessages } from 'react-intl'

// Strings for report form 'Greinargerð'
export const icReportForm = {
  heading: defineMessage({
    id: 'judicial.system.investigation_cases:report_form.heading',
    defaultMessage: 'Greinargerð',
    description:
      'Notaður sem titill á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  caseFacts: defineMessages({
    heading: {
      id: 'judicial.system.investigation_cases:report_form.case_facts.heading',
      defaultMessage: 'Greinargerð um málsatvik',
      description:
        'Notaður sem titill fyrir "málsatvik" hlutann á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    tooltip: {
      id: 'judicial.system.investigation_cases:report_form.case_facts.tooltip',
      defaultMessage:
        'Málsatvik, hvernig meðferð þessa máls hófst, skal skrá hér ásamt framburðum vitna og sakborninga ef til eru. Einnig er gott að taka fram stöðu rannsóknar og næstu skref.',
      description:
        'Notaður sem upplýsingatexti í upplýsingasvæði við "málsatvik" titlinn á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    label: {
      id: 'judicial.system.investigation_cases:report_form.case_facts.label',
      defaultMessage: 'Málsatvik',
      description:
        'Notaður sem titill í textaboxi fyrir "málsatvik" á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    placeholder: {
      id: 'judicial.system.investigation_cases:report_form.case_facts.placeholder',
      defaultMessage:
        'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
      description:
        'Notaður sem skýritexti í textaboxi fyrir "málsatvik" á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
  }),
  legalArguments: defineMessages({
    heading: {
      id: 'judicial.system.investigation_cases:report_form.legal_arguments.heading',
      defaultMessage: 'Greinargerð um lagarök',
      description:
        'Notaður sem titill fyrir "lagarök" hlutann á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    tooltip: {
      id: 'judicial.system.investigation_cases:report_form.legal_arguments.tooltip',
      defaultMessage:
        'Lagarök og lagaákvæði sem eiga við brotið og kröfuna skal taka fram hér.',
      description:
        'Notaður sem upplýsingatexti í upplýsingasvæði við "lagarök" titlinn á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    label: {
      id: 'judicial.system.investigation_cases:report_form.legal_arguments.label',
      defaultMessage: 'Lagarök',
      description:
        'Notaður sem titill í textaboxi fyrir "lagarök" á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    placeholder: {
      id: 'judicial.system.investigation_cases:report_form.legal_arguments.placeholder',
      defaultMessage: 'Hver eru lagarökin fyrir kröfu um gæsluvarðhald?',
      description:
        'Notaður sem skýritexti í textaboxi fyrir "lagarök" á greinargerðar skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
  }),
  prosecutorOnly: {
    checkbox: defineMessages({
      label: {
        id: 'judicial.system.investigation_cases:report_form.prosecutor_only.checkbox.label',
        defaultMessage: 'Beiðni um dómþing að varnaraðila fjarstöddum',
        description:
          'Notaður sem texti í "beiðni um dómþing að..." gátreit á greinargerðar skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id: 'judicial.system.investigation_cases:report_form.prosecutor_only.checkbox.tooltip',
        defaultMessage:
          'Hér er hægt að setja fram kröfu um að dómþing fari fram að varnaraðila fjarstöddum sé það nauðsynlegt vegna rannsóknarhagsmuna. Með því að haka í reitinn birtist krafan neðst í skjalinu.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "beiðni um dómþing að..." gátreit á greinargerðar skrefi í rannsóknarheimildum.',
      },
    }),
    input: defineMessages({
      label: {
        id: 'judicial.system.investigation_cases:report_form.prosecutor_only.input.label',
        defaultMessage: 'Beiðni',
        description:
          'Notaður sem titill í "beiðni" textaboxi á greinargerðar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id: 'judicial.system.investigation_cases:report_form.prosecutor_only.input.placeholder',
        defaultMessage:
          'Er þess óskað að varnaraðili sé ekki viðstaddur dómþing?',
        description:
          'Notaður sem skýritexti í "beiðni" textaboxi á greinargerðar skrefi í rannsóknarheimildum',
      },
      defaultValue: {
        id: 'judicial.system.investigation_cases:report_form.prosecutor_only.input.default_value',
        defaultMessage:
          'Beðið er um að krafan verði tekin fyrir án þess að þeir sem hún beinist að verði kvaddir á dómþingið.',
        description:
          'Sjálfgefinn texti í "beiðni" textaboxi á greinargerðar skrefi í rannsóknarheimildum',
      },
    }),
  },
}

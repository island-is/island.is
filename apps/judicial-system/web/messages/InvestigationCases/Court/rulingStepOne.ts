import { defineMessage, defineMessages } from 'react-intl'

export const icRulingStepOne = {
  title: defineMessage({
    id: 'judicial.system.investigation_cases:ruling_step_one.title',
    defaultMessage: 'Úrskurður',
    description: 'Notaður sem titill á úrskurðar skrefi í rannsóknarheimildum.',
  }),
  sections: {
    courtCaseFacts: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.court_case_facts.title',
        defaultMessage: 'Greinargerð um málsatvik',
        description:
          'Notaður sem titill fyrir "greinargerð um málsatvik" hlutann á úrskurðar skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.court_case_facts.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um málsatvik" titlinn á úrskurðar skrefi í rannsóknarheimildum.',
      },
      label: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.court_case_facts.label',
        defaultMessage: 'Greinargerð um málsatvik',
        description:
          'Notaður sem titill fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.court_case_facts.placeholder',
        defaultMessage:
          'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
        description:
          'Notaður sem skýritexti fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
    courtLegalArguments: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.court_legal_arguments.title',
        defaultMessage: 'Greinargerð um lagarök',
        description:
          'Notaður sem titill fyrir "Greinargerð um lagarök" hlutann á úrskurðar skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.court_legal_arguments.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um lagarök" titlinn á úrskurðar skrefi í rannsóknarheimildum.',
      },
      label: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.court_legal_arguments.label',
        defaultMessage: 'Greinargerð um lagarök',
        description:
          'Notaður sem titill fyrir "Lagarök" innsláttarsvæðið á úrskurðar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.court_legal_arguments.placeholder',
        defaultMessage:
          'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
        description:
          'Notaður sem skýritexti fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
    decision: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.decision.title',
        defaultMessage: 'Úrskurður',
        description:
          'Notaður sem titill fyrir "Úrskurður" hlutann á úrskurðar skrefi í rannsóknarheimildum.',
      },
      dismissLabel: {
        id:
          'judicial.system.investigation_cases:ruling_step_one.decision.dismiss_label',
        defaultMessage: 'Kröfu vísað frá',
        description:
          'Notaður sem texti við radio takka með vali um að vísa máli frá á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
    ruling: defineMessages({
      title: {
        id: 'judicial.system.investigation_cases:ruling_step_one.ruling.title',
        defaultMessage: 'Niðurstaða',
        description:
          'Notaður sem titill fyrir "Niðurstaða" hlutann á úrskurðar skrefi í rannsóknarheimildum.',
      },
    }),
  },
}

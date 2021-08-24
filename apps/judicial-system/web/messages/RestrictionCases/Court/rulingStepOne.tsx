import { defineMessages } from 'react-intl'

export const rcRulingStepOne = {
  sections: {
    courtCaseFacts: defineMessages({
      tooltip: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.court_case_facts.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um málsatvik" titlinn á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    courtLegalArguments: defineMessages({
      tooltip: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.court_legal_arguments.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um lagarök" titlinn á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}

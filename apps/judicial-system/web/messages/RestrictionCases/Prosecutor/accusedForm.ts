import { defineMessage, defineMessages } from 'react-intl'

export const accused = {
  heading: defineMessage({
    id: 'judicial.system.restriction_cases:accused.heading',
    defaultMessage: 'Sakborningur',
    description:
      'Notaður sem titill á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    accusedInfo: {
      heading: defineMessage({
        id: 'judicial.system.restriction_cases:accused.accused_info.heading',
        defaultMessage: 'Sakborningur',
        description:
          'Notaður sem titill fyrir "upplýsingar um sakborning" hlutann á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      }),
    },
    leadInvestigator: defineMessages({
      heading: {
        id: 'judicial.system.restriction_cases:accused.lead_investigator.heading',
        defaultMessage: 'Stjórnandi rannsóknar',
        description:
          'Notaður sem titill fyrir "stjórnanda rannsóknar" hlutann á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id: 'judicial.system.restriction_cases:accused.lead_investigator.tooltip',
        defaultMessage:
          'Upplýsingar um stjórnanda rannsóknar birtast á vistunarseðli sem berst til gæslufangelsis.',
        description:
          'Notaður sem aðstoðartexti fyrir "stjórnanda rannsóknar" hlutann á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.restriction_cases:accused.lead_investigator.label',
        defaultMessage: 'Sláðu inn stjórnanda rannsóknar',
        description:
          'Notaður sem titill í textaboxi fyrir "stjórnanda rannsóknar" á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id: 'judicial.system.restriction_cases:accused.lead_investigator.placeholder',
        defaultMessage: 'Hver stýrir rannsókn málsins?',
        description:
          'Notaður sem skýritexti í textaboxi fyrir "stjórnanda rannsóknar" á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}

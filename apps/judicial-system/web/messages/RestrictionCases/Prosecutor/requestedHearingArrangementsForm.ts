import { defineMessage, defineMessages } from 'react-intl'

export const rcRequestedHearingArrangements = {
  heading: defineMessage({
    id: 'judicial.system.restriction_cases:requested_hearing_arrangements.heading',
    defaultMessage: 'Óskir um fyrirtöku',
    description:
      'Notaður sem titill á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    arrestDate: defineMessages({
      heading: {
        id: 'judicial.system.restriction_cases:requested_hearing_arrangements.arrest_date.heading',
        defaultMessage: 'Tími handtöku',
        description:
          'Notaður sem titill fyrir "tími handtöku" hlutann á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    translator: defineMessages({
      heading: {
        id: 'judicial.system.restriction_cases:requested_hearing_arrangements.translator.heading',
        defaultMessage: 'Túlkur',
        description:
          'Notaður sem titill fyrir "Túlkur" hlutann á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id: 'judicial.system.restriction_cases:requested_hearing_arrangements.translator.label',
        defaultMessage: 'Nafn túlks',
        description:
          'Notaður sem titill í textaboxi fyrir "Túlkur" á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id: 'judicial.system.restriction_cases:requested_hearing_arrangements.translator.placeholder',
        defaultMessage: 'Fullt nafn',
        description:
          'Notaður sem skýritexti í textaboxi fyrir "Túlkur" á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
  modal: defineMessages({
    heading: {
      id: 'judicial.system.restriction_cases:requested_hearing_arrangements.modal.heading',
      defaultMessage: 'Viltu senda tilkynningu?',
      description:
        'Notaður sem titill fyrir "viltu senda tilkynningu" tilkynningagluggan á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    textV2: {
      id: 'judicial.system.restriction_cases:requested_hearing_arrangements.modal.text_v2',
      defaultMessage:
        'Með því að senda tilkynningu á dómara og dómritara á vakt um að krafa um {caseType, select, ADMISSION_TO_FACILITY {vistun í viðeigandi stofun} TRAVEL_BAN {farbann} other {gæsluvarhald}} sé í vinnslu flýtir það fyrir málsmeðferð og allir aðilar eru upplýstir.',
      description:
        'Notaður sem texti í "viltu senda tilkynningu" tilkynningaglugganum á óskir um fyrirtöku skrefi í gæsluvarðhalds-, vistunar- og farbannsmálum.',
    },
  }),
}

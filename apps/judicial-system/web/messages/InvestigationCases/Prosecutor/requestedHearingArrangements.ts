import { defineMessage, defineMessages } from 'react-intl'

export const icRequestedHearingArrangements = {
  heading: defineMessage({
    id:
      'judicial.system.investigation_cases:requested_hearing_arrangements.heading',
    defaultMessage: 'Óskir um fyrirtöku',
    description:
      'Notaður sem titill á óskir um fyrirtöku skrefi í rannsóknarheimildum.',
  }),
  modal: defineMessages({
    heading: {
      id:
        'judicial.system.investigation_cases:requested_hearing_arrangements.modal.heading',
      defaultMessage: 'Viltu senda tilkynningu?',
      description:
        'Notaður sem titill fyrir "viltu senda tilkynningu" tilkynningagluggan á óskir um fyrirtöku skrefi í rannsóknarheimildum.',
    },
    text: {
      id:
        'judicial.system.investigation_cases:requested_hearing_arrangements.modal.text',
      defaultMessage:
        'Með því að senda tilkynningu á dómara og dómritara á vakt um að krafa um rannsóknarheimild sé í vinnslu flýtir það fyrir málsmeðferð og allir aðilar eru upplýstir.',
      description:
        'Notaður sem texti í "viltu senda tilkynningu" tilkynningaglugganum á óskir um fyrirtöku skrefi í rannsóknarheimildum.',
    },
  }),
}

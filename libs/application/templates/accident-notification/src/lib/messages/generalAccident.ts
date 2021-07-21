import { defineMessages } from 'react-intl'

export const generalAccident = {
  accidentLocation: defineMessages({
    atTheWorkplace: {
      id: 'an.application:generalAccident.accidentLocation.atTheWorkplace',
      defaultMessage: 'Á vinnustað',
      description:
        'Label for the at the workplace option in general accident location',
    },
    toOrFromTheWorkplace: {
      id:
        'an.application:generalAccident.accidentLocation.toOrFromTheWorkplace',
      defaultMessage: 'Á leið til eða frá vinnustað',
      description:
        'Label for the to or from the workplace option in general accident location',
    },
    other: {
      id: 'an.application:generalAccident.accidentLocation.other',
      defaultMessage: 'Annarsstaðar á vegum vinnunar',
      description:
        'Label for the to or from the other option in general accident location',
    },
    heading: {
      id: 'an.application:generalAccident.accidentLocation.heading',
      defaultMessage: 'Hvar gerðist slysið?',
      description: 'General accident location heading',
    },
  }),
}

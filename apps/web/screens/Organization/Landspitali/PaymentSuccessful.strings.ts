import { defineMessages } from 'react-intl'

export const m = defineMessages({
  mainTitle: {
    id: 'web.landspitali.paymentSuccessful:mainTitle',
    defaultMessage: 'Greiðsla tókst',
    description: 'Aðaltitill',
  },
  subTitleWhenNationalIdProvided: {
    id: 'web.landspitali.paymentSuccessful:subTitleWhenNationalIdProvided',
    defaultMessage: 'Kvittun mun berast í stafrænt pósthólf greiðanda',
    description: 'Undirtitill þegar greiðandi gefur upp kennitölu',
  },
  subTitleWhenNationalIdNotProvided: {
    id: 'web.landspitali.paymentSuccessful:subTitleWhenNationalIdNotProvided',
    defaultMessage: ' ',
    description: 'Undirtitill þegar greiðandi gefur ekki upp kennitölu',
  },
})

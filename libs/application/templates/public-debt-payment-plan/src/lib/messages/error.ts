import { defineMessages } from 'react-intl'

export const error = defineMessages({
  paymentMode: {
    id: `pdpp.application:application.error.paymentMode`,
    defaultMessage: 'Vinsamlegast veldu greiðsludreifingarleið',
    description: 'Choose payment mode',
  },
  nationalId: {
    id: `pdpp.application:application.error.nationalId`,
    defaultMessage: 'Kennitala þarf að vera gild',
    description: 'National ID error message',
  },
})

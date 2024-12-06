import { defineMessages } from 'react-intl'

export const error = defineMessages({
  errorDataProvider: {
    id: 'ss.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  errorValidateCanCreateTitle: {
    id: 'ss.application:error.errorValidateCanCreateTitle',
    defaultMessage: 'Ekki er hægt að opna nýja umsókn',
    description: 'Error validate can create title',
  },
  errorValidateCanCreateDescription: {
    id: 'ss.application:error.errorValidateCanCreateTitle',
    defaultMessage:
      'Þú ert með aðra opna umsókn í gangi, vinsamlegast eyðið henni áður en opnað er nýja umsókn',
    description: 'Error validate can create description',
  },
})

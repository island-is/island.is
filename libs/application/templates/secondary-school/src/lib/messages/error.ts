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
  errorDeletePastRegistrationEndTitle: {
    id: 'ss.application:error.errorDeletePastRegistrationEndTitle',
    defaultMessage: 'Ekki er hægt að eyða umsókn',
    description: 'Error delete application past registration end date title',
  },
  errorDeletePastRegistrationEndDescription: {
    id: 'ss.application:error.errorDeletePastRegistrationEndDescription',
    defaultMessage:
      'Ekki er hægt að eyða umsókn eftir að skráningartímabili lýkur',
    description:
      'Error delete application past registration end date description',
  },
  errorPastRegistrationDateTitle: {
    id: 'ss.application:error.errorPastRegistrationDateTitle',
    defaultMessage: 'Athugið',
    description: 'Error past registration date title',
  },
  errorPastRegistrationDateDescription: {
    id: 'ss.application:error.errorPastRegistrationDateDescription',
    defaultMessage:
      'Ekki er hægt að senda inn umsókn, þar sem umsóknartímabilinu hefur lokið',
    description: 'Error past registration date title',
  },
})

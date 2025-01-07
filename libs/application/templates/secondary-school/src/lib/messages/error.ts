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
  errorSubmitApplicationTitle: {
    id: 'ss.application:error.errorSubmitApplicationTitle',
    defaultMessage: 'Ekki er tókst að senda inn umsókn',
    description: 'Error submit application title',
  },
  errorSubmitApplicationDescription: {
    id: 'ss.application:error.errorSubmitApplicationDescription',
    defaultMessage:
      'Ekki tókst að senda inn umsókn, vinsamlegast reyndu síðar..',
    description: 'Error submit application description',
  },
})

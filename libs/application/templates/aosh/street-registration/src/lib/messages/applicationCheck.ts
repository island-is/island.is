import { defineMessages } from 'react-intl'

export const applicationCheck = {
  validation: defineMessages({
    alertTitle: {
      id: 'aosh.sr.application:applicationCheck.validation.alertTitle',
      defaultMessage: 'Það kom upp villa',
      description: 'Application check validation alert title',
    },
    noMachine: {
      id: 'aosh.sr.application:applicationCheck.validation.noMachine',
      defaultMessage: 'Engin vél hefur verið valin',
      description: 'No machine selected',
    },
    inspectBeforeRegistration: {
      id: 'aosh.sr.application:applicationCheck.validation.inspectBeforeRegistration',
      defaultMessage: 'Hafið samband við Vinnueftirlitið til að götuskrá',
      description: 'Pick machine inspect before registration',
    },
    unavailableTypeForRegistration: {
      id: 'aosh.sr.application:applicationCheck.validation.unavailableTypeForRegistration',
      defaultMessage: 'Ekki er hægt að götuskrá tæki í þessum flokk',
      description: 'Pick machine has type that is not valid for registration',
    },
  }),
}

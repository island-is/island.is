import { defineMessages } from 'react-intl'

export const applicationCheck = {
  validation: defineMessages({
    alertTitle: {
      id: 'aosh.drm.application:applicationCheck.validation.alertTitle',
      defaultMessage: 'Það kom upp villa',
      description: 'Application check validation alert title',
    },
    noMachine: {
      id: 'aosh.drm.application:applicationCheck.validation.noMachine',
      defaultMessage: 'Engin vél hefur verið valin',
      description: 'No machine selected',
    },
  }),
}

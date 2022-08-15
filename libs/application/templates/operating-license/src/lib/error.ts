import { defineMessages } from 'react-intl'

export const error = defineMessages({
  invalidValue: {
    id: 'ol.application:error.invalidValue',
    defaultMessage: 'Ógilt gildi.',
    description: 'Error message when a value is invalid.',
  },
  attachments: {
    id: 'ol.application:error.attachments',
    defaultMessage: 'Ætti að innihalda a.m.k. þrjú skjöl.',
    description: 'Error message when a value is invalid.',
  },
  openingHours: {
    id: 'ol.application:error.openingHours',
    defaultMessage: 'Vinsamlegast fylltu út afgreiðslutíma.',
    description: 'Error message when a value is invalid.',
  },
  debug: {
    id: 'ol.application:error.debug',
    defaultMessage: 'DEBUG',
    description: 'Error message when a value is invalid.',
  },
})

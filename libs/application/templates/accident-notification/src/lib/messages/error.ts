import { defineMessages } from 'react-intl'

export const error = defineMessages({
  invalidValue: {
    id: 'an.application:error.invalidValue',
    defaultMessage: 'Ógilt gildi.',
    description: 'Error message when a value is invalid.',
  },
  required: {
    id: 'an.application:error.required',
    defaultMessage: 'Skylda er að fylla út reitinn',
    description: 'Error message when a required field has not been filled out',
  },
  requiredCheckmark: {
    id: 'an.application:error.requiredCheckmark',
    defaultMessage: 'Skylda er að haka í ofangreindan reit',
    description:
      'Error message when a required field has not pressed checkmark',
  },
  requiredFile: {
    id: 'an.application:error.requiredFile',
    defaultMessage: 'Skylda er að hlaða upp skjali áður en haldið er áfram',
    description: 'Error message when a required file field has not been filled',
  },
  attachmentMaxSizeError: {
    id: 'an.application:error.attachment.maxSizeError',
    defaultMessage: 'Hámark 10 MB á skrá',
    description: 'Max 10 MB per file',
  },
})

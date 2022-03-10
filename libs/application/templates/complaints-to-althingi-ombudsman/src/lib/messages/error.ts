import { defineMessages } from 'react-intl'

// Error messages in the application
export const error = defineMessages({
  required: {
    id: 'ctao.application:error.required',
    defaultMessage: 'Skylda er að fylla út reitinn',
    description: 'Error message when a required field has not been filled out',
  },
})

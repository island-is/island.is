import { defineMessages } from 'react-intl'

export const error = defineMessages({
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
})

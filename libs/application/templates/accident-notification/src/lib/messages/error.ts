import { defineMessages } from 'react-intl'

export const error = defineMessages({
  required: {
    id: 'an.application:error.required',
    defaultMessage: 'Skylda er að fylla út reitinn.',
    description: 'Error message when a required field has not been filled out',
  },
  requiredCheckmark: {
    id: 'an.application:error.requiredCheckmark',
    defaultMessage: 'Skylda er að haka í ofangreindan reit.',
    description:
      'Error message when a required field has not pressed checkmark',
  },
  requiredFile: {
    id: 'an.application:error.requiredFile',
    defaultMessage: 'Skylda er að hlaða upp skjali áður en haldið er áfram.',
    description: 'Error message when a required file field has not been filled',
  },
  validNationalId: {
    id: 'an.application:error.validNationalId',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'National Id should be valid',
  },
  companyHasNationalId: {
    id: 'an.application:error.companyHasNationalId',
    defaultMessage: 'Þetta er fyrirtækjarkennitala.',
    description: 'National Id belongs to company',
  },
  noPersonNationalId: {
    id: 'an.application:error.personNationalId',
    defaultMessage: 'Það á engin manneskjan þessa kennitölu.',
    description: 'National Id does not belong to person',
  },
})

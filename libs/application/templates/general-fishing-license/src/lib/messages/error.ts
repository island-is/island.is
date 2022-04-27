import { defineMessages } from 'react-intl'

export const error = defineMessages({
  invalidValue: {
    id: 'gfl.application:error.invalidValue',
    defaultMessage: 'Ógilt gildi.',
    description: 'Error message when a value is invalid.',
  },
  required: {
    id: 'gfl.application:error.required',
    defaultMessage: 'Skylda er að fylla út reitinn',
    description: 'Error message when a required field has not been filled out',
  },
  requiredCheckmark: {
    id: 'gfl.application:error.requiredCheckmark',
    defaultMessage: 'Skylda er að haka í ofangreindan reit',
    description:
      'Error message when a required field has not pressed checkmark',
  },
  requiredFile: {
    id: 'gfl.application:error.requiredFile',
    defaultMessage: 'Skylda er að hlaða upp skjali áður en haldið er áfram',
    description: 'Error message when a required file field has not been filled',
  },
  requiredRadioField: {
    id: 'gfl.application:error.requiredRadioField',
    defaultMessage: 'Skylda er að haka í einn af ofangreindum reitum',
    description:
      'Error message when a required field has not pressed a radio option',
  },
  feeProviderError: {
    id: 'gfl.application:error.feeProviderError',
    defaultMessage:
      'Villa kom upp við að sækja verðskrá hjá Fjársýslunni fyrir Fiskistofu',
    description: 'Error came up',
  },
})

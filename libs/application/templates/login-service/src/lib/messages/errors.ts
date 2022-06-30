import { defineMessages } from 'react-intl'

export const errorMessages = defineMessages({
  termsAgreementRequired: {
    id: `ls.application:errors.termsAgreementRequired`,
    defaultMessage: 'Skylda er að samþykkja skilmálana til að halda áfram',
    description: 'Terms agreement required error message',
  },
  required: {
    id: `ls.application:errors.requiredDefaultMessage`,
    defaultMessage: 'Skylda er að fylla út þennan reit',
    description: 'Required default error message',
  },
  nationalId: {
    id: `ls.application:errors.nationalId`,
    defaultMessage: 'Kennitala þarf að vera gild',
    description: 'National ID error message',
  },
  invalidIsatNumber: {
    id: `ls.application:errors.invalidIsatNumber`,
    defaultMessage: 'ÍSAT númer verður að byrja á 84',
    description: 'Invalid ÍSAT number error message',
  },
})

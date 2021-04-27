import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

export const errorMessages = defineMessages({
  termsAgreementRequired: {
    id: `${t}:errors.termsAgreementRequired`,
    defaultMessage: 'Skylda er að samþykkja skilmálana til að halda áfram',
    description: 'Terms agreement required error message',
  },
})

import { defineMessage } from 'react-intl'

export const smsErrorMessage = defineMessage({
  id: 'sp.settings:sms-error-message',
  defaultMessage:
    'Eitthvað fór úrskeiðis, ekki tókst að senda SMS í þetta símanúmer',
})

export const wrongCodeErrorMessage = defineMessage({
  id: 'sp.settings:wrong-code-message',
  defaultMessage: 'Eitthvað fór úrskeiðis, kóði var ekki réttur',
})

export const codeErrorMessage = defineMessage({
  id: 'sp.settings:code-error-message',
  defaultMessage: 'Eitthvað fór úrskeiðis, kóði var ekki réttur',
})

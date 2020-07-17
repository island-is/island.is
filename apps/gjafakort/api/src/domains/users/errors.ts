import { ApolloError } from 'apollo-server-express'

import { CONFIRM_CODE_ERROR } from '@island.is/gjafakort/consts'

export class ConfirmCodeError extends ApolloError {
  constructor() {
    const message = 'confirmCodeForm.errors.confirmCode'
    const code = CONFIRM_CODE_ERROR
    super(message, code)
  }
}

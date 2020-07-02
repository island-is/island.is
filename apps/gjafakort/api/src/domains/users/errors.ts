import { ApolloError } from 'apollo-server-express'

export class ConfirmCodeError extends ApolloError {
  constructor() {
    const message = 'confirmCodeForm.errors.confirmCode'
    const code = 'CONFIRM_CODE_ERROR'
    super(message, code)
  }
}

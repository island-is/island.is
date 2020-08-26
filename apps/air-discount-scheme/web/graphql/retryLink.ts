import { ServerError } from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'

export default new RetryLink({
  attempts: {
    max: 2,
    retryIf: (error: ServerError) => !!error,
  },
})

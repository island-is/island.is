import { ServerError } from '@apollo/client'
import { RetryLink as retryLink } from '@apollo/client/link/retry'

const RetryLink = new retryLink({
  attempts: {
    max: 2,
    retryIf: (error: ServerError) => error && true,
  },
})

export default RetryLink

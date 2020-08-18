import { RetryLink } from 'apollo-link-retry'
import { ServerError } from 'apollo-link-http-common'

export default new RetryLink({
  attempts: {
    max: 2,
    retryIf: (error: ServerError) => !!error,
  },
})

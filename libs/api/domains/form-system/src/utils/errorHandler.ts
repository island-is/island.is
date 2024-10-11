import { ApolloError } from '@apollo/client'

/* eslint-disable */
export function handle4xx(
  error: any,
  handleError: (e: any, detail?: string) => ApolloError | null,
  errorDetail?: string,
) {
  if (error.status === 403 || error.status === 404) {
    return null
  }
  return handleError(error, errorDetail)
}
/* eslint-enable */

import { ApolloError } from '@apollo/client'

export interface CourtUploadError {
  errorCode?: string
  detail: string
}

/**
 * An ApolloError does not always carry GraphQL errors - a network failure, for
 * example, produces one with an empty graphQLErrors array - so every step down
 * to the problem detail has to be optional.
 */
export const resolveCourtUploadError = (error: unknown): CourtUploadError => {
  const extensions =
    error instanceof ApolloError
      ? error.graphQLErrors?.[0]?.extensions
      : undefined

  const code = extensions?.code
  const detail = (extensions?.problem as { detail?: unknown } | undefined)
    ?.detail

  return {
    errorCode: typeof code === 'string' ? code : undefined,
    detail: typeof detail === 'string' ? detail : '',
  }
}

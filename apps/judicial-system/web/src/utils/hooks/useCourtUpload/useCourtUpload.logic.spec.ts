import { ApolloError } from '@apollo/client'
import { GraphQLError } from 'graphql'

import { resolveCourtUploadError } from './useCourtUpload.logic'

const apolloError = (extensions: Record<string, unknown>) =>
  new ApolloError({
    graphQLErrors: [new GraphQLError('Upload failed', { extensions })],
  })

describe('resolveCourtUploadError', () => {
  it('reads the error code and problem detail from the first GraphQL error', () => {
    const error = apolloError({
      code: 'https://httpstatuses.org/404',
      problem: { detail: 'Case Not Found' },
    })

    expect(resolveCourtUploadError(error)).toEqual({
      errorCode: 'https://httpstatuses.org/404',
      detail: 'Case Not Found',
    })
  })

  it('falls back to an empty detail when the problem is missing', () => {
    const error = apolloError({ code: 'https://httpstatuses.org/415' })

    expect(resolveCourtUploadError(error)).toEqual({
      errorCode: 'https://httpstatuses.org/415',
      detail: '',
    })
  })

  it('handles an ApolloError without GraphQL errors, such as a network failure', () => {
    const error = new ApolloError({
      networkError: new Error('Failed to fetch'),
    })

    expect(error.graphQLErrors).toHaveLength(0)
    expect(resolveCourtUploadError(error)).toEqual({
      errorCode: undefined,
      detail: '',
    })
  })

  it('handles errors that are not ApolloErrors', () => {
    expect(resolveCourtUploadError(new Error('Boom'))).toEqual({
      errorCode: undefined,
      detail: '',
    })
    expect(resolveCourtUploadError(undefined)).toEqual({
      errorCode: undefined,
      detail: '',
    })
  })

  it('ignores a non-string code or detail', () => {
    const error = apolloError({ code: 404, problem: { detail: { nested: 1 } } })

    expect(resolveCourtUploadError(error)).toEqual({
      errorCode: undefined,
      detail: '',
    })
  })
})

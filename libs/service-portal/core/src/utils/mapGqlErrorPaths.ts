import { ApolloError } from '@apollo/client'

export const mapGqlErrorPaths = (
  error: ApolloError,
  possiblePaths: Array<string>,
) => {
  if (error?.graphQLErrors) {
    const confirmedPaths: Array<string> = []
    error.graphQLErrors.forEach((e) => {
      const paths = e.path ? [...e.path] : []
      paths.forEach((p) => {
        if (typeof p === 'number') {
          return
        }
        if (possiblePaths.includes(p)) {
          confirmedPaths.push(p)
        }
        return
      })
    })
    return confirmedPaths
  }

  return []
}

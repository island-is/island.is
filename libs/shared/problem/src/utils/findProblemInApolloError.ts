import type { ApolloError } from '@apollo/client'
import { Problem } from '../Problem'

interface ProblemExtensions {
  problem?: Problem
  exception?: {
    problem?: Problem
  }
}

export const findProblemInApolloError = (
  error: ApolloError | undefined,
  types?: string[],
): Problem | undefined => {
  if (!error) {
    return undefined
  }
  const graphQLError = error.graphQLErrors.find((value) => {
    const extensions = value.extensions as ProblemExtensions | undefined
    const problem = extensions?.problem || extensions?.exception?.problem
    return problem && (!types || types.includes(problem.type))
  })

  if (!graphQLError) {
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return graphQLError.extensions!.problem as Problem
}

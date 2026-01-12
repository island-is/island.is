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

  const problems = error.graphQLErrors
    .map((value) => {
      const extensions = value.extensions as ProblemExtensions | undefined
      const problem = extensions?.problem || extensions?.exception?.problem
      if (problem && (!types || types.includes(problem.type))) {
        return problem
      }
    })
    .filter((problem) => problem) as Problem[]

  if (problems.length === 0) {
    return undefined
  }

  return problems[0]
}

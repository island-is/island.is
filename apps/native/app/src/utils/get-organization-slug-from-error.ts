import { ApolloError } from '@apollo/client'

type PartialProblem = {
  organizationSlug?: string
}

type CustomExtension = {
  code: string
  problem?: PartialProblem
  exception?: {
    problem?: PartialProblem
  }
}

/**
 * Extracts the organization slug from the Apollo error, if it exists.
 */
export const getOrganizationSlugFromError = (error: ApolloError | unknown) => {
  const graphQLErrors = (error as ApolloError)?.graphQLErrors

  if (graphQLErrors) {
    for (const graphQLError of graphQLErrors) {
      const extensions = graphQLError.extensions as CustomExtension

      const organizationSlug =
        extensions?.problem?.organizationSlug ??
        extensions?.exception?.problem?.organizationSlug

      if (organizationSlug) {
        return organizationSlug
      }
    }
  }

  return undefined
}

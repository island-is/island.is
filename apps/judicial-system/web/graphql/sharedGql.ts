import { gql } from '@apollo/client'

export const PoliceCaseFilesQuery = gql`
  query GetPoliceCaseFiles($input: PoliceCaseFilesQueryInput!) {
    policeCaseFiles(input: $input) {
      id
      name
      policeCaseNumber
    }
  }
`

import { gql } from '@apollo/client'

export const PoliceCaseFilesQuery = gql`
  query GetPoliceCaseFiles2($input: PoliceCaseFilesQueryInput!) {
    policeCaseFiles(input: $input) {
      id
      name
      policeCaseNumber
    }
  }
`

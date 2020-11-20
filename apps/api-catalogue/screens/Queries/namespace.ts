import gql from 'graphql-tag'

export const GET_NAMESPACE_QUERY = gql`
  query GetNamespace($input: GetNamespaceInput!) {
    getNamespace(input: $input) {
      fields
    }
  }
`

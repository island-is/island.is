import gql from 'graphql-tag'

export const GET_CATALOGUES_QUERY = gql`
  query GetApiCatalogueById($input: GetApiCatalogueInput!) {
    getApiCatalogueById(input: $input) {
      id
      owner
      serviceName
      description
    }
  }
`

import gql from 'graphql-tag'

export const GET_CATALOGUES_QUERY = gql`
  query getCatalogues() {
    catalogues() {
     id
     owner
     serviceName
     description
    }
  }
`

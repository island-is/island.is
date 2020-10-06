import gql from 'graphql-tag'

export const GET_CATALOGUE_QUERY = gql`
  query GetApiCatalogue($input: GetApiCatalogueInput!) {
    getApiCatalogue(input: $input) {
      services {
        id
        name
        owner
        pricing
        type
        access
        data
      }
      pageInfo {
        nextCursor
      }
    }
  }
`

export const GET_API_SERVICE_QUERY = gql`
  query GetApiServiceById($input: GetApiServiceInput!) {
    getApiServiceById(input: $input) {
      id
      owner
      name
      description
      data
      pricing
      access
      xroadIdentifier {
        instance
        memberCode
        memberClass
        subsystemCode
        serviceCode
      }
    }
  }
`

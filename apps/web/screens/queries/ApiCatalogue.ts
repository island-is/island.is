import gql from 'graphql-tag'

export const GET_CATALOGUE_QUERY = gql`
  query GetApiCatalogue($input: GetApiCatalogueInput!) {
    getApiCatalogue(input: $input) {
      services {
        id
        title
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
      title
      description
      data
      pricing
      access
      type
      versions {
        versionId
        details {
          title
          description
          type
          pricing
          data
          xroadIdentifier {
            instance
            memberCode
            memberClass
            subsystemCode
            serviceCode
          }
        }
      }
    }
  }
`

export const GET_OPEN_API_QUERY = gql`
  query GetOpenApi($input: GetOpenApiInput!) {
    getOpenApi(input: $input) {
      spec
    }
  }
`

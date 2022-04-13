import gql from 'graphql-tag'

export const GET_PUBLISHED_MATERIAL_QUERY = gql`
  query GetPublishedMaterial($input: GetPublishedMaterialInput!) {
    getPublishedMaterial(input: $input) {
      input {
        lang
        size
        page
        organizationSlug
        searchString
        tags
        tagGroups
        sort
      }
      total
      items {
        id
        title
        description
        file {
          url
          title
          contentType
        }
        organization {
          title
          slug
        }
        releaseDate
        genericTags {
          id
          title
          slug
          genericTagGroup {
            id
            title
            slug
          }
        }
      }
    }
  }
`

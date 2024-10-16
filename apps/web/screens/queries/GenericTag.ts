import gql from 'graphql-tag'

export const GET_GENERIC_TAG_BY_SLUG_QUERY = gql`
  query GetGenericTagBySlug($input: GetGenericTagBySlugInput!) {
    getGenericTagBySlug(input: $input) {
      id
      slug
    }
  }
`

export const GET_GENERIC_TAG_IN_TAG_GROUP_QUERY = gql`
  query GetGenericTagInTagGroup($input: GetGenericTagInTagGroupInput!) {
    getGenericTagsInTagGroup(input: $input) {
      id
      title
      genericTagGroup {
        id
        title
      }
    }
  }
`

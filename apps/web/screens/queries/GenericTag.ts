import gql from 'graphql-tag'

export const GET_GENERIC_TAG_BY_SLUG_QUERY = gql`
  query GetGenericTagBySlug($input: GetGenericTagBySlugInput!) {
    getGenericTagBySlug(input: $input) {
      id
      slug
    }
  }
`

export const GET_GENERIC_TAGS_IN_TAG_GROUPS_QUERY = gql`
  query GetGenericTagInTagGroups($input: GetGenericTagsInTagGroupsInput!) {
    getGenericTagsInTagGroups(input: $input) {
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
`

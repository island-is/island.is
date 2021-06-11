import gql from 'graphql-tag'

export const GET_FRESHDESK_CATEGORIES = gql`
  query FreshdeskGetCategories {
    freshdeskGetCategories {
      id
      name
      description
    }
  }
`

export const FRESHDESK_SEARCH = gql`
  query FreshdeskSearch($input: SearchInput!) {
    freshdeskSearch(input: $input) {
      title
      description
    }
  }
`

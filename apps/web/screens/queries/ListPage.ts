import gql from 'graphql-tag'

export const GET_LIST_PAGE_QUERY = gql`
  query GetListPage($input: GetListPageInput!) {
    getListPage(input: $input) {
      title
      relativeUrl
    }
  }
`

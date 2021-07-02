import gql from 'graphql-tag'

export const GET_OPEN_DATA_PAGE_QUERY =gql`
  query GetOpenDataPage($input: GetOpenDataPageInput!){
    getOpenDataPage(input: $input) {
      pageTitle
    }
  }
`
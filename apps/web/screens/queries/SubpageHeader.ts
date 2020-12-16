import gql from 'graphql-tag'

export const GET_SUBPAGE_HEADER_QUERY = gql`
  query GetSubpageHeader($input: GetSubpageHeaderInput!) {
    getSubpageHeader(input: $input) {
      subpageId
      title
      summary
      featuredImage {
        url
        title
        width
        height
      }
      content
    }
  }
`

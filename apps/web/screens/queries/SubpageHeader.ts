import gql from 'graphql-tag'

export const GET_SUBPAGE_HEADER_QUERY = gql`
  fragment ImageFields on Image {
    __typename
    id
    title
    url
    contentType
    width
    height
  }

  query GetSubpageHeader($input: GetSubpageHeaderInput!) {
    getSubpageHeader(input: $input) {
      subpageId
      title
      summary
      featuredImage {
        ...ImageFields
      }
      content
    }
  }
`

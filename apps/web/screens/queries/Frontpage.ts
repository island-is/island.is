import gql from 'graphql-tag'

export const GET_FRONTPAGE_QUERY = gql`
  query GetFrontpage($input: GetFrontpageInput!) {
    getFrontpage(input: $input) {
      __typename
      id
      featured {
        title
        attention
        thing {
          slug
          type
        }
      }
      lifeEvents {
        id
        title
        slug
        intro
        image {
          __typename
          id
          title
          url
          contentType
          width
          height
        }
        thumbnail {
          url
          title
        }
      }
      slides {
        subtitle
        intro {
          ... on Html {
            __typename
            id
            document
          }
        }
        title
        content
        link
        animationJsonAsset {
          id
          typename
          url
        }
      }
      namespace {
        fields
      }
    }
  }
`

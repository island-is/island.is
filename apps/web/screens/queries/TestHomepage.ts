import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_TEST_HOMEPAGE_QUERY = gql`
  query GetTestHomepage($input: GetTestHomepageInput!) {
    getTestHomepage(input: $input) {
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
        animationJson
      }
      namespace {
        fields
      }
    }
  }
`

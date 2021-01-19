import gql from 'graphql-tag'

export const GET_FRONTPAGE_SLIDES_QUERY = gql`
  query GetFrontpageSliderList($input: GetFrontpageSliderListInput!) {
    getFrontpageSliderList(input: $input) {
      items {
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
    }
  }
`

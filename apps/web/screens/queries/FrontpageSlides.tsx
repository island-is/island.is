import gql from 'graphql-tag'

export const GET_FRONTPAGE_SLIDES_QUERY = gql`
  query GetFrontpageSliderList($input: GetFrontpageSliderListInput!) {
    getFrontpageSliderList(input: $input) {
      items {
        subtitle
        title
        content
        animationJson
        slideLink {
          text
          url
          linkedPage {
            title
            page {
              title
              slug
              type
            }
          }
        }
      }
    }
  }
`

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
          id
          text
          url
          linkReference {
            type
            slug
            url
          }
        }
      }
    }
  }
`

import { gql } from '@apollo/client'

export const GET_FRONTPAGE_SLIDES = gql`
  query GetFrontpageSliderList($input: GetFrontpageSliderListInput!) {
    getFrontpageSliderList(input: $input) {
      items {
        subtitle
        title
        content
        link
        image {
          url
          title
          contentType
          width
          height
        }
      }
    }
  }
`

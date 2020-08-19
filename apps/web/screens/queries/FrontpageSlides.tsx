import gql from 'graphql-tag'

export const GET_FRONTPAGE_SLIDES_QUERY = gql`
  query GetFrontpageSlides($input: GetFrontpageSlidesInput!) {
    getFrontpageSlides(input: $input) {
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

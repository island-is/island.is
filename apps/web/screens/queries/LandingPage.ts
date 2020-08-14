import gql from 'graphql-tag'

export const GET_LANDING_PAGE_QUERY = gql`
  query($input: GetLandingPageInput!) {
    getLandingPage(input: $input) {
      title
      slug
      introduction
      image {
        title
        url
        contentType
        width
        height
      }
      actionButton {
        text
        url
      }
      links {
        title
        links {
          text
          url
        }
      }
      content
    }
  }
`

import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_LANDING_PAGE_QUERY = gql`
  query GetLandingPage($input: GetLandingPageInput!) {
    getLandingPage(input: $input) {
      title
      slug
      introduction
      image {
        ...ImageFields
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
      content {
        ...AllSlices
      }
    }
  }
  ${slices}
`

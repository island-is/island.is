import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_ABOUT_PAGE_QUERY = gql`
  query GetAboutPage($input: GetAboutPageInput!) {
    getAboutPage(input: $input) {
      title
      seoDescription
      theme
      pageHeader {
        id
        title
        introduction
        navigationText
        links {
          text
          url
        }
        slices {
          ...AllSlices
        }
      }
      slices {
        ...AllSlices
      }
    }
  }
  ${slices}
`

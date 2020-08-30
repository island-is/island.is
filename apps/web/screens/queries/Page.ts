import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_PAGE_QUERY = gql`
  query GetAboutPage($input: GetAboutPageInput!) {
    getAboutPage(input: $input) {
      title
      seoDescription
      theme
      slices {
        ...AllSlices
      }
    }
  }
  ${slices}
`

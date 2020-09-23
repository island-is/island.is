import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_ABOUT_SUB_PAGE_QUERY = gql`
  query GetAboutSubPage($input: GetAboutSubPageInput!) {
    getAboutSubPage(input: $input) {
      title
      slug
      description
      subDescription
      slices {
        ...AllSlices
      }
    }
  }
  ${slices}
`

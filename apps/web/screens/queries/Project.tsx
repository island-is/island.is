import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_PROJECT_PAGE_QUERY = gql`
  query GetProjectPage($input: GetProjectPageInput!) {
    getProjectPage(input: $input) {
      id
      title
      slug
      theme
      sidebar
      sidebarLinks {
        text
        url
      }
      subtitle
      intro
      content {
        ...AllSlices
      }
      slices {
        ...AllSlices
      }
      newsTag {
        id
        title
        slug
      }
      projectSubpages {
        title
        slug
        content {
          ...AllSlices
        }
        slices {
          ...AllSlices
        }
      }
    }
  }
  ${slices}
`

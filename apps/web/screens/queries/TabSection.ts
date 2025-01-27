import gql from 'graphql-tag'

import { nestedFields, slices } from './fragments'

export const GET_TAB_SECTION_QUERY = gql`
  query GetTabSection($input: GetTabSectionInput!) {
    getTabSection(input: $input) {
      ... on TabSection {
        ...TabSectionFields
        tabs {
          tabTitle
          contentTitle
          image {
            ...ImageFields
          }
          body {
            ...AllSlices
            ${nestedFields}
          }
        }
      }
    }
  }
  ${slices}
`

import gql from 'graphql-tag'

import { slices } from './fragments'

export const GET_SUBPAGE_HEADER_QUERY = gql`
  query GetSubpageHeader($input: GetSubpageHeaderInput!) {
    getSubpageHeader(input: $input) {
      subpageId
      title
      summary
      featuredImage {
        ...ImageFields
      }
      body {
        ...AllSlices
      }
    }
  }
  ${slices}
`

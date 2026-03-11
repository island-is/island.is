import gql from 'graphql-tag'

import { slices } from './fragments'

export const GET_ERROR_PAGE = gql`
  query ErrorPage($input: GetErrorPageInput!) {
    getErrorPage(input: $input) {
      errorCode
      title
      description {
        ...AllSlices
      }
    }
  }
  ${slices}
`

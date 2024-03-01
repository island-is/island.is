import { Query } from '@island.is/api/schema'
import { gql } from '@apollo/client'
import type { WrappedLoaderFn } from '@island.is/portals/core'
import { pageSize } from './Overview/Overview'

export const GET_PAGE_NUMBER_QUERY = gql`
  query GetDocumentPageNumber($input: GetDocumentPageInput!) {
    getDocumentPageNumber(input: $input) {
      messagePage
    }
  }
`

export const documentLoader: WrappedLoaderFn =
  ({ client }) =>
  async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const idParam = urlParams.get('id')
      if (idParam) {
        const { data } = await client.query<Query>({
          query: GET_PAGE_NUMBER_QUERY,
          variables: {
            input: {
              pageSize: pageSize,
              messageId: idParam,
            },
          },
        })
        return data?.getDocumentPageNumber.messagePage ?? 1
      }
      return 1
    } catch {
      return 1
    }
  }

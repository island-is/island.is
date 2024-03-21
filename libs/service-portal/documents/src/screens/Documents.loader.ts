import { Query } from '@island.is/api/schema'
import { gql } from '@apollo/client'
import { matchPath } from 'react-router'
import type { WrappedLoaderFn } from '@island.is/portals/core'
import { pageSize } from './Overview/Overview'
import { DocumentsPaths } from '../lib/paths'
import { ServicePortalPaths } from '@island.is/service-portal/core'

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
      const pathName = window.location.pathname
      const match = matchPath(
        {
          path: `${ServicePortalPaths.Base}${DocumentsPaths.ElectronicDocumentSingle}`,
        },
        pathName,
      )
      if (match && match.params && match.params.id) {
        const { data } = await client.query<Query>({
          query: GET_PAGE_NUMBER_QUERY,
          variables: {
            input: {
              pageSize: pageSize,
              messageId: match.params.id,
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

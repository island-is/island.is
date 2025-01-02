import { Query } from '@island.is/api/schema'
import { gql } from '@apollo/client'
import type { WrappedLoaderFn } from '@island.is/portals/core'

export const GET_TAPS_QUERY = gql`
  query GetTapsQuery {
    getCustomerTapControl {
      RecordsTap
      employeeClaimsTap
      localTaxTap
      schedulesTap
    }
  }
`

export const financeRoutesLoader: WrappedLoaderFn =
  ({ client }) =>
  async () => {
    try {
      const { data } = await client.query<Query>({
        query: GET_TAPS_QUERY,
      })
      return data?.getCustomerTapControl
    } catch {
      return null
    }
  }

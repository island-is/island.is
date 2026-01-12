import { Query } from '@island.is/api/schema'
import { gql } from '@apollo/client'
import type { WrappedLoaderFn } from '@island.is/portals/core'
import { plausibleSwapDataDomain } from '../utils/plausibleSwapDataDomain'

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

export const financeDomainLoader: WrappedLoaderFn = () => async () => {
  try {
    plausibleSwapDataDomain('finance')
    return null
  } catch {
    return null
  }
}

export const financeRoutesLoader: WrappedLoaderFn =
  ({ client }) =>
  async () => {
    try {
      plausibleSwapDataDomain('finance')
      const { data } = await client.query<Query>({
        query: GET_TAPS_QUERY,
      })
      return data?.getCustomerTapControl
    } catch {
      return null
    }
  }

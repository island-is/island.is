import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { ServicePortalPath } from '../../lib/navigation/paths'
import uniq from 'lodash/uniq'

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

/**
 * Returns an active navigation that matches all defined module routes
 */
export const useDynamicRoutes = () => {
  const [activeDynamicRoutes, setActiveDynamicRoutes] = useState<
    ServicePortalPath[]
  >([])

  const { data, loading } = useQuery<Query>(GET_TAPS_QUERY)

  useEffect(() => {
    /**
     * service-portal/finance
     * Tabs control for finance routes. Transactions, claims, tax, finance schedule.
     */
    const tabData = data?.getCustomerTapControl
    const dynamicPathArray = []

    if (tabData?.RecordsTap) {
      dynamicPathArray.push(ServicePortalPath.FinanceTransactions)
    }
    if (tabData?.employeeClaimsTap) {
      dynamicPathArray.push(ServicePortalPath.FinanceEmployeeClaims)
    }
    if (tabData?.localTaxTap) {
      dynamicPathArray.push(ServicePortalPath.FinanceLocalTax)
    }
    if (tabData?.schedulesTap) {
      dynamicPathArray.push(ServicePortalPath.FinanceSchedule)
    }

    setActiveDynamicRoutes(uniq([...activeDynamicRoutes, ...dynamicPathArray]))
  }, [data])

  return { activeDynamicRoutes, loading }
}

export default useDynamicRoutes

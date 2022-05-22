import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { ServicePortalPath } from '@island.is/service-portal/core'
import uniq from 'lodash/uniq'

const GET_DEBT_STATUS = gql`
  query FinanceGetDebtStatus {
    getDebtStatus {
      myDebtStatus {
        approvedSchedule
        possibleToSchedule
      }
    }
  }
`

export const GET_TAPS_QUERY = gql`
  query GetTapsQuery {
    getCustomerTapControl {
      RecordsTap
      employeeClaimsTap
      localTaxTap
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
  const { data: debtData, loading: debtLoading } = useQuery<Query>(
    GET_DEBT_STATUS,
  )

  useEffect(() => {
    /**
     * service-portal/finance
     * Tabs control for finance routes. Transactions, claims, tax.
     */
    const tabData = data?.getCustomerTapControl
    const dynamicPathArray = []

    if (tabData?.RecordsTap) {
      dynamicPathArray.push(ServicePortalPath.FinanceTransactions)
    }
    if (tabData?.employeeClaimsTap) {
      dynamicPathArray.push(ServicePortalPath.FinanceEmployeeClaims)
    }
    if (tabData?.employeeClaimsTap) {
      dynamicPathArray.push(ServicePortalPath.FinanceLocalTax)
    }

    /**
     * service-portal/finance
     * Finance schedule route
     */
    const debtStatus = debtData?.getDebtStatus?.myDebtStatus || []

    if (
      debtStatus &&
      debtStatus.length > 0 &&
      (debtStatus[0].approvedSchedule > 0 ||
        debtStatus[0].possibleToSchedule > 0)
    ) {
      dynamicPathArray.push(ServicePortalPath.FinanceSchedule)
    }

    setActiveDynamicRoutes(uniq([...activeDynamicRoutes, ...dynamicPathArray]))
  }, [data, debtData])

  return { activeDynamicRoutes, loading: loading || debtLoading }
}

export default useDynamicRoutes

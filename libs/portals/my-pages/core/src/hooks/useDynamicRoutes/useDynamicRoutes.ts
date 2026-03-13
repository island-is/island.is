import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { Query, QueryGetNamespaceArgs } from '@island.is/api/schema'
import uniq from 'lodash/uniq'
import { PortalNavigationItem, useNavigation } from '@island.is/portals/core'
import { DynamicPaths } from './paths'
import { orderRoutes } from '../../utils/orderRoutes'

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

export const GET_DRIVING_LICENSE_BOOK_QUERY = gql`
  query GetDrivingLicenseBook {
    drivingLicenseBookUserBook {
      book {
        id
      }
    }
  }
`

/**
 * TODO: Replace with a real unemployment-status query once the service
 * client is available, e.g.:
 *
 *   query GetUnemploymentStatus {
 *     unemploymentStatus {
 *       isActive
 *     }
 *   }
 *
 * When `isActive === true` push `DynamicPaths.UnemploymentStatus` to
 * `dynamicPathArray` inside the `useDynamicRoutes` effect below.
 */
export const GET_UNEMPLOYMENT_STATUS_QUERY = gql`
  query GetUnemploymentStatus {
    # placeholder – replace when API is ready
    __typename
  }
`

export const GET_NAMESPACE_QUERY = gql`
  query GetNamespace($input: GetNamespaceInput!) {
    getNamespace(input: $input) {
      fields
    }
  }
`

/**
 * Returns an active navigation that matches all defined module routes
 */
export const useDynamicRoutes = () => {
  const [activeDynamicRoutes, setActiveDynamicRoutes] = useState<string[]>([])

  const { data, loading } = useQuery<Query>(GET_TAPS_QUERY)

  const { data: licenseBook, loading: licenseBookLoading } = useQuery<Query>(
    GET_DRIVING_LICENSE_BOOK_QUERY,
  )

  /**
   * TODO: Swap the placeholder query for the real unemployment-status query.
   * When `unemploymentStatus.isActive` is true, uncomment the push below.
   */
  // const { data: unemploymentData } = useQuery<Query>(GET_UNEMPLOYMENT_STATUS_QUERY)

  useEffect(() => {
    const dynamicPathArray = []

    /**
     * portals-my-pages/finance
     * Tabs control for finance routes. Transactions, claims, tax, finance schedule.
     */
    const tabData = data?.getCustomerTapControl

    if (tabData?.RecordsTap) {
      dynamicPathArray.push(DynamicPaths.FinanceTransactions)
      dynamicPathArray.push(DynamicPaths.FinanceTransactionPeriods)
      dynamicPathArray.push(DynamicPaths.FinanceTransactionVehicleMileage)
    }
    if (tabData?.employeeClaimsTap) {
      dynamicPathArray.push(DynamicPaths.FinanceEmployeeClaims)
    }
    if (tabData?.localTaxTap) {
      dynamicPathArray.push(DynamicPaths.FinanceLocalTax)
    }
    if (tabData?.schedulesTap) {
      dynamicPathArray.push(DynamicPaths.FinancePaymentsSchedule)
    }

    /**
     * portals-my-pages/vehicles
     * Tabs control for driving lessons.
     */
    const licenseBookData = licenseBook?.drivingLicenseBookUserBook
    if (licenseBookData?.book?.id) {
      dynamicPathArray.push(DynamicPaths.EducationDrivingLessons)
    }

    /**
     * portals-my-pages/support-maintenance – Unemployment
     * Show the "Staðan þín" sub-page only when the user has active benefits.
     *
     * TODO: Replace the hardcoded `false` with the real API check:
     *   const isActiveOnUnemployment = !!unemploymentData?.unemploymentStatus?.isActive
     */
    const isActiveOnUnemployment = true
    if (isActiveOnUnemployment) {
      dynamicPathArray.push(DynamicPaths.UnemploymentStatus)
    }

    // Combine routes, no duplicates.
    setActiveDynamicRoutes(uniq([...activeDynamicRoutes, ...dynamicPathArray]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, licenseBook])

  return { activeDynamicRoutes, loading: loading && licenseBookLoading }
}

export const useDynamicRoutesWithNavigation = (nav: PortalNavigationItem) => {
  const { activeDynamicRoutes } = useDynamicRoutes()
  const { data } = useQuery<Query, QueryGetNamespaceArgs>(GET_NAMESPACE_QUERY, {
    variables: {
      input: {
        namespace: 'Mínar síður Ísland.is',
        lang: 'is-IS', // No translation needed.
      },
    },
  })

  const sortedNavigation = orderRoutes(nav, data?.getNamespace?.fields)

  const navigation = useNavigation(sortedNavigation, activeDynamicRoutes)

  return navigation
}

import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { ServicePortalPath } from '../../lib/navigation/paths'
import uniq from 'lodash/uniq'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { FeatureFlagClient, Features } from '@island.is/feature-flags'
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
 * Returns an active navigation that matches all defined module routes
 */
export const useDynamicRoutes = () => {
  const [activeDynamicRoutes, setActiveDynamicRoutes] = useState<
    ServicePortalPath[]
  >([])
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const [
    drivingLessonsFlagEnabled,
    setDrivingLessonsFlagEnabled,
  ] = useState<boolean>(false)

  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        Features.servicePortalDrivingLessonsBookModule,
        false,
      )
      setDrivingLessonsFlagEnabled(ffEnabled as boolean)
    }
    isFlagEnabled()
  }, [])

  const { data, loading } = useQuery<Query>(GET_TAPS_QUERY)

  const { data: licenseBook, loading: licenseBookLoading } = useQuery<Query>(
    GET_DRIVING_LICENSE_BOOK_QUERY,
  )

  useEffect(() => {
    /**
     * service-portal/finance
     * Tabs control for finance routes. Transactions, claims, tax, finance schedule.
     */
    const tabData = data?.getCustomerTapControl

    const licenseBookData = licenseBook?.drivingLicenseBookUserBook

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

    if (drivingLessonsFlagEnabled && licenseBookData?.book?.id) {
      dynamicPathArray.push(ServicePortalPath.AssetsVehiclesDrivingLessons)
    }
    setActiveDynamicRoutes(uniq([...activeDynamicRoutes, ...dynamicPathArray]))
  }, [data, licenseBook])

  return { activeDynamicRoutes, loading: loading && licenseBookLoading }
}

export default useDynamicRoutes

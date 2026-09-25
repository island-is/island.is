import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { Query, QueryGetNamespaceArgs } from '@island.is/api/schema'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import uniq from 'lodash/uniq'
import { PortalNavigationItem, useNavigation } from '@island.is/portals/core'
import { DynamicPaths } from './paths'
import { m } from '../../lib/messages'
import { orderRoutes } from '../../utils/orderRoutes'
export { parseMenuConfig } from '../../utils/orderRoutes'

// Hardcoded — core can't import HealthPaths (health imports core).
const HEALTH_ROUTE = '/heilsa'
const HEALTH_CONVERSATIONS_ROUTE = '/heilsa/skilabod'
const HEALTH_TREATMENT_BASE_ROUTE = '/heilsa/medferd'

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

export const GET_VMST_APPLICATIONS_OVERVIEW_QUERY = gql`
  query GetVmstApplicationsOverviewDynamic {
    vmstApplicationsOverview {
      unemploymentApplication {
        isVisible
      }
      activationGrant {
        isVisible
      }
    }
  }
`

export const GET_HEALTH_TREATMENTS_NAV_QUERY = gql`
  query GetHealthTreatmentsNavigation {
    healthDirectorateTreatments {
      id
      name
    }
  }
`

export const GET_HEALTH_PREGNANCY_NAV_QUERY = gql`
  query GetHealthPregnancyNavigation {
    healthDirectorateHasActivePregnancy
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

  const { value: unemploymentBenefitsEnabled, loading: vmstFlagLoading } =
    useFeatureFlag(
      Features.isServicePortalUnemploymentBenefitsPageEnabled,
      false,
    )

  const {
    value: activationAllowanceEnabled,
    loading: activationAllowanceFlagLoading,
  } = useFeatureFlag(
    Features.isServicePortalActivationAllowancePageEnabled,
    false,
  )

  const { data: vmstOverview, loading: vmstLoading } = useQuery(
    GET_VMST_APPLICATIONS_OVERVIEW_QUERY,
    {
      skip: !unemploymentBenefitsEnabled && !activationAllowanceEnabled,
    },
  )

  const { value: pregnancyEnabled } = useFeatureFlag(
    Features.isServicePortalHealthPregnancyPageEnabled,
    false,
  )

  const { pathname } = useLocation()

  // Only fetches on health pages; the cache then serves every consumer.
  // Deliberately excluded from the loading aggregate below so it never
  // delays other dynamic screens.
  const { data: pregnancyData } = useQuery<Query>(
    GET_HEALTH_PREGNANCY_NAV_QUERY,
    {
      skip: !pregnancyEnabled,
      fetchPolicy: pathname.startsWith(HEALTH_ROUTE)
        ? 'cache-first'
        : 'cache-only',
    },
  )

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
     * portals-my-pages/social-benefits
     * Show unemployment benefits child routes only if user has visible application.
     * Show activation allowance child routes only if user has visible application.
     */
    const vmstData = vmstOverview?.vmstApplicationsOverview
    if (
      unemploymentBenefitsEnabled &&
      vmstData?.unemploymentApplication?.isVisible
    ) {
      dynamicPathArray.push(DynamicPaths.SocialBenefitsUnemploymentStatus)
      dynamicPathArray.push(DynamicPaths.SocialBenefitsUnemploymentMyData)
    }
    if (activationAllowanceEnabled && vmstData?.activationGrant?.isVisible) {
      dynamicPathArray.push(
        DynamicPaths.SocialBenefitsActivationAllowanceStatus,
      )
      dynamicPathArray.push(
        DynamicPaths.SocialBenefitsActivationAllowanceMyData,
      )
    }

    /**
     * portals-my-pages/health
     * Show pregnancy routes only if the user has an active pregnancy.
     */
    if (pregnancyData?.healthDirectorateHasActivePregnancy) {
      dynamicPathArray.push(DynamicPaths.HealthPregnancy)
      dynamicPathArray.push(DynamicPaths.HealthPregnancyOverview)
    }

    // Combine routes, no duplicates.
    setActiveDynamicRoutes(uniq([...activeDynamicRoutes, ...dynamicPathArray]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, licenseBook, vmstOverview, pregnancyData])

  return {
    activeDynamicRoutes,
    loading:
      loading ||
      licenseBookLoading ||
      vmstFlagLoading ||
      activationAllowanceFlagLoading ||
      vmstLoading,
  }
}

// Hidden pages under a treatment, mirroring the global messages and
// questionnaires entries so breadcrumbs lead back to the treatment.
const treatmentChildren = (base: string): PortalNavigationItem[] => [
  {
    name: m.healthTreatmentEducationalContent,
    path: `${base}/fraedsluefni`,
    navHide: true,
    systemRoute: true,
  },
  {
    name: m.messages,
    path: `${base}/skilabod`,
    navHide: true,
    systemRoute: true,
    children: [
      {
        name: m.messages,
        path: `${base}/skilabod/nytt`,
        navHide: true,
        breadcrumbHide: true,
        mobileTakeover: true,
        systemRoute: true,
      },
      {
        name: m.messages,
        path: `${base}/skilabod/:id`,
        navHide: true,
        breadcrumbHide: true,
        mobileTakeover: true,
        systemRoute: true,
      },
    ],
  },
  {
    name: m.questionnaires,
    path: `${base}/spurningalistar`,
    navHide: true,
    systemRoute: true,
    children: [
      {
        name: m.questionnaire,
        path: `${base}/spurningalistar/:org/:id`,
        navHide: true,
        systemRoute: true,
        children: [
          {
            name: m.questionnaire,
            path: `${base}/spurningalistar/:org/:id/svara`,
            navHide: true,
            breadcrumbHide: true,
            systemRoute: true,
          },
          {
            name: m.questionnaire,
            path: `${base}/spurningalistar/:org/:id/skoda-svor/:submissionId`,
            navHide: true,
            systemRoute: true,
          },
        ],
      },
    ],
  },
]

/**
 * Adds a "Meðferð" section under Heilsa with one child per treatment.
 */
const injectHealthTreatmentNavItems = (
  nav: PortalNavigationItem,
  treatments: Array<{ id: string; name: string }>,
): PortalNavigationItem => ({
  ...nav,
  children: nav.children?.map((child) => {
    if (child.path !== HEALTH_ROUTE) {
      return child
    }
    const treatmentsParent: PortalNavigationItem = {
      name: m.healthTreatment,
      path: HEALTH_TREATMENT_BASE_ROUTE,
      children: treatments.map((treatment) => ({
        name: treatment.name.trim() || m.healthTreatment,
        path: `${HEALTH_TREATMENT_BASE_ROUTE}/${treatment.id}`,
        systemRoute: true,
        children: treatmentChildren(
          `${HEALTH_TREATMENT_BASE_ROUTE}/${treatment.id}`,
        ),
      })),
    }
    const healthChildren = [...(child.children ?? [])]
    const conversationsIndex = healthChildren.findIndex(
      (item) => item.path === HEALTH_CONVERSATIONS_ROUTE,
    )
    healthChildren.splice(
      conversationsIndex >= 0 ? conversationsIndex + 1 : healthChildren.length,
      0,
      treatmentsParent,
    )
    return { ...child, children: healthChildren }
  }),
})

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

  const { value: treatmentsEnabled } = useFeatureFlag(
    Features.isServicePortalHealthTreatmentsPageEnabled,
    false,
  )

  const { pathname } = useLocation()
  const onHealthPage = pathname.startsWith(HEALTH_ROUTE)

  // Only fetches on health pages; the cache then serves every consumer.
  // Kept out of useDynamicRoutes so it never delays other dynamic screens.
  const { data: treatmentsData } = useQuery<Query>(
    GET_HEALTH_TREATMENTS_NAV_QUERY,
    {
      skip: !treatmentsEnabled,
      fetchPolicy: onHealthPage ? 'cache-first' : 'cache-only',
    },
  )

  const sortedNavigation = orderRoutes(nav, data?.getNamespace?.fields)

  // Memoized so useNavigation sees a stable object; namespace fields re-sort
  // the tree when they load.
  const navigation = useMemo(() => {
    const treatments = treatmentsData?.healthDirectorateTreatments
    if (!treatments?.length) {
      return sortedNavigation
    }
    return injectHealthTreatmentNavItems(sortedNavigation, treatments)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedNavigation, treatmentsData, data?.getNamespace?.fields])

  return useNavigation(navigation, activeDynamicRoutes)
}

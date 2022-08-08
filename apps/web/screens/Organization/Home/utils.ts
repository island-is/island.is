import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { AlertBannerVariants } from '@island.is/island-ui/core'
import {
  GetAlertBannerQuery,
  Query,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { getFeatureFlag } from '@island.is/web/utils/featureFlag'
import { ParsedUrlQuery } from 'querystring'
import { GET_NAMESPACE_QUERY } from '../../queries'

interface SjukratryggingarStatusPageDetails {
  incidents: {
    created_at: string // "2014-05-14T14:22:39.441-06:00",
    id: string // "cp306tmzcl0y",
    impact: string // "critical",
    incident_updates: {
      body: string
      created_at: string
      display_at: string
      id: string
      incident_id: string
      status: string // "identified",
      updated_at: string
    }[]
    monitoring_at: null | string
    name: string
    page_id: string
    resolved_at: null | string
    shortlink: string // "http://stspg.co:5000/Q0E",
    status: string // "identified",
    updated_at: string // "2014-05-14T14:35:21.711-06:00"
  }[]
  scheduled_maintenances: {
    created_at: string
    id: string // "w1zdr745wmfy",
    impact: string // "none",
    incident_updates: {
      body: string
      created_at: string // "2014-05-14T14:24:41.913-06:00",
      display_at: string // "2014-05-14T14:24:41.913-06:00",
      id: string // "qq0vx910b3qj",
      incident_id: string // "w1zdr745wmfy",
      status: string // "scheduled",
      updated_at: string // "2014-05-14T14:24:41.913-06:00"
    }[]
    monitoring_at: null | string
    name: string
    page_id: string
    resolved_at: null | string
    scheduled_for: string
    scheduled_until: string
    shortlink: string // "http://stspg.co:5000/Q0F",
    status: string // "scheduled",
    updated_at: string // "2014-05-14T14:24:41.918-06:00"
  }[]
}

const fetchSjukratryggingarStatusPageDetails = async (): Promise<SjukratryggingarStatusPageDetails> => {
  try {
    const response = await fetch('https://status.sjukra.is/api/v2/summary.json')
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

/** Gets all custom alert banners (banners that are read from somewhere else than the content management system) */
export const getCustomAlertBanners = async (
  query: ParsedUrlQuery,
  apolloClient: ApolloClient<NormalizedCacheObject>,
  locale: string,
) => {
  // Make sure that the feature flag is enabled
  const flag = await getFeatureFlag('showSjukratryggingarStatusAlerts', false)
  if (!flag) return []

  // As of right now Sjúkratryggingar is the only organization with alert banners that are automatically read from somewhere else than the CMS (Contentful)
  if (
    query?.slug !== 'sjukratryggingar' &&
    query?.slug !== 'icelandic-health-insurance'
  )
    return []

  const [sjukratryggingarPageDetails, namespace] = await Promise.all([
    fetchSjukratryggingarStatusPageDetails(),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Sjukratryggingar',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])
  if (!sjukratryggingarPageDetails) return []
  const customAlertBanners: GetAlertBannerQuery['getAlertBanner'][] = []

  for (const incident of sjukratryggingarPageDetails?.incidents ?? []) {
    const bannerVariant: AlertBannerVariants = 'warning'
    const title = incident?.name
    const description = incident?.incident_updates?.[0]?.body
    const showAlertBanner = title?.length > 0 || description?.length > 0

    customAlertBanners.push({
      bannerVariant,
      dismissedForDays: 1,
      isDismissable: true,
      showAlertBanner,
      title,
      description,
      link: {
        slug:
          namespace['incidentStatusPageLink'] ??
          `https://status.sjukra.is/incidents/${incident.id}`,
        type: 'link',
      },
      linkTitle: namespace['incidentSeeMoreText'] ?? 'Frekari upplýsingar',
    })
  }

  for (const maintenance of sjukratryggingarPageDetails?.scheduled_maintenances ??
    []) {
    const bannerVariant: AlertBannerVariants = 'info'
    const title = maintenance?.name
    const description = maintenance?.incident_updates?.[0]?.body
    const showAlertBanner = title?.length > 0 || description?.length > 0
    customAlertBanners.push({
      bannerVariant,
      dismissedForDays: 1,
      isDismissable: true,
      showAlertBanner,
      title,
      description,
      link: {
        slug:
          namespace['maintenanceStatusPageLink'] ??
          `https://status.sjukra.is/incidents/${maintenance.id}`,
        type: 'link',
      },
      linkTitle: namespace['maintenanceSeeMoreText'] ?? 'Frekari upplýsingar',
    })
  }

  return customAlertBanners
}

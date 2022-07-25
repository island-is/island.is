import { AlertBannerVariants } from '@island.is/island-ui/core'
import { GetAlertBannerQuery } from '@island.is/web/graphql/schema'
import { ParsedUrlQuery } from 'querystring'

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

export const getCustomAlertBanners = async (query: ParsedUrlQuery) => {
  // As of right now Sjúkratryggingar is the only organization with alert banners that are automatically read from somewhere else than the CMS (Contentful)
  if (
    query?.slug !== 'sjukratryggingar' &&
    query?.slug !== 'icelandic-health-insurance'
  )
    return []

  const sjukratryggingarPageDetails = await fetchSjukratryggingarStatusPageDetails()
  if (!sjukratryggingarPageDetails) return []
  const customAlertBanners: GetAlertBannerQuery['getAlertBanner'][] = []

  for (const incident of sjukratryggingarPageDetails?.incidents ?? []) {
    const bannerVariant: AlertBannerVariants = 'warning'
    customAlertBanners.push({
      bannerVariant,
      dismissedForDays: 1,
      isDismissable: true,
      showAlertBanner: true,
      description: incident?.name,
      // TODO: read link from cms
      link: {
        slug: 'https://status.sjukra.is',
        type: '',
      },
      linkTitle: 'Frekari upplýsingar',
    })
  }

  for (const maintenance of sjukratryggingarPageDetails?.scheduled_maintenances ??
    []) {
    const bannerVariant: AlertBannerVariants = 'info'
    customAlertBanners.push({
      bannerVariant,
      dismissedForDays: 1,
      isDismissable: true,
      showAlertBanner: true,
      description: maintenance?.name,
      // TODO: read link from cms
      link: {
        slug: 'https://status.sjukra.is',
        type: '',
      },
      linkTitle: 'Frekari upplýsingar',
    })
  }

  customAlertBanners.push({
    bannerVariant: 'info',
    dismissedForDays: 1,
    isDismissable: true,
    showAlertBanner: true,
    description: 'asdf',
    // TODO: read link from cms
    link: {
      slug: 'https://status.sjukra.is',
      type: '',
    },
    linkTitle: 'Frekari upplýsingar',
  })

  return customAlertBanners
}

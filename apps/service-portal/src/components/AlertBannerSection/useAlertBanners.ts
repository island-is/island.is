import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import { useQuery } from '@apollo/client'
import { AlertBanner as AlertBannerSchema } from '@island.is/service-portal/graphql'
import { GET_SERVICE_PORTAL_ALERT_BANNERS_QUERY } from './queries'

type AlertBannerType = AlertBannerSchema & { bannerId: string }

// Taken from here: https://stackoverflow.com/a/7616484
export const stringHash = (str: string): number => {
  let hash = 0,
    i,
    chr
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

export const useAlertBanners = () => {
  const allBanners = useRef<AlertBannerSchema[]>([])
  const [banners, setBanners] = useState<AlertBannerType[]>([])

  const updateBanners = (updatedBanners: AlertBannerSchema[]) => {
    if (!updatedBanners) return

    setBanners(
      updatedBanners
        .map((banner: AlertBannerSchema) => {
          const bannerId = `alert-${stringHash(JSON.stringify(banner))}`
          return {
            ...banner,
            bannerId,
          } as AlertBannerType
        })
        .filter((banner: AlertBannerType) => {
          let alertBannerBelongsToCurrentPage = false

          // TODO: figure out a way to generate schema types
          for (const path of (banner as any)?.servicePortalPaths ?? []) {
            if (path === '*' || window.location.href.includes(path)) {
              alertBannerBelongsToCurrentPage = true
              break
            }
          }

          return (
            !Cookies.get(banner.bannerId) &&
            banner?.showAlertBanner &&
            alertBannerBelongsToCurrentPage
          )
        }),
    )
  }

  useQuery(GET_SERVICE_PORTAL_ALERT_BANNERS_QUERY, {
    // TODO: figure out a way to determine what language the current page is set to
    variables: { input: { lang: 'is-IS' } },
    onCompleted: (data) => {
      const bannerList = data?.getServicePortalAlertBanners
      if (!bannerList) return
      allBanners.current = bannerList
      updateBanners(bannerList)
    },
  })

  // When the route changes we update what banners are shown since banners might only be visible on a specific route and hidden on other routes
  useEffect(() => {
    updateBanners(allBanners.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href])

  return banners
}

import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import { stringHash } from '@island.is/shared/utils'
import { useQuery } from '@apollo/client'
import { AlertBanner as AlertBannerSchema } from '@island.is/api/schema'
import { GET_SERVICE_PORTAL_ALERT_BANNERS_QUERY } from '../../lib/queries/alertBanners'
import { useLocale } from '@island.is/localization'

export type AlertBannerType = AlertBannerSchema & { bannerId: string }

export const useAlertBanners = () => {
  const allBanners = useRef<AlertBannerSchema[]>([])
  const [banners, setBanners] = useState<AlertBannerType[]>([])
  const { lang } = useLocale()

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
        .filter(
          (banner: AlertBannerType) =>
            !Cookies.get(banner.bannerId) && banner?.showAlertBanner,
        ),
    )
  }

  useQuery(GET_SERVICE_PORTAL_ALERT_BANNERS_QUERY, {
    variables: { input: { lang: lang === 'is' ? 'is-IS' : lang } },
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
  }, [window.location.href])

  return banners
}

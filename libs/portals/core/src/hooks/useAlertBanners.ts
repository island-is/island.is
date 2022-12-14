import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import { useLocale } from '@island.is/localization'
import { stringHash } from '../utils/stringHash'
import {
  GetServicePortalAlertBannersQuery,
  useGetServicePortalAlertBannersQuery,
} from '../components/ModuleAlertMessageSection/ModuleAlertMessageSection.generated'

type AlertBannerSchema = Extract<
  NonNullable<
    GetServicePortalAlertBannersQuery['getServicePortalAlertBanners']
  >[number],
  { __typename?: 'AlertBanner' }
>

export type AlertBannerType = AlertBannerSchema & {
  bannerId: string
}

export const useAlertBanners = () => {
  const allBanners = useRef<AlertBannerSchema[]>([])
  const [banners, setBanners] = useState<AlertBannerType[]>([])
  const { lang } = useLocale()

  const updateBanners = (updatedBanners: AlertBannerSchema[]) => {
    if (!updatedBanners) return

    setBanners(
      updatedBanners
        .map((banner) => ({
          ...banner,
          bannerId: `alert-${stringHash(JSON.stringify(banner))}`,
        }))
        .filter(
          (banner) => !Cookies.get(banner.bannerId) && banner?.showAlertBanner,
        ),
    )
  }

  useGetServicePortalAlertBannersQuery({
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

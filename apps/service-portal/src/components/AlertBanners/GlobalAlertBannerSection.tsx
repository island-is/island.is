import Cookies from 'js-cookie'
import { AlertBanner } from '@island.is/island-ui/core'
import { AlertBannerVariants } from '@island.is/island-ui/core'
import { useAlertBanners } from './useAlertBanners'

export const GlobalAlertBannerSection = () => {
  const banners = useAlertBanners()

  return (
    <>
      {banners
        .filter((banner) => banner.servicePortalPaths?.includes('*'))
        .map((banner) => (
          <AlertBanner
            key={banner.bannerId}
            title={banner.title as string}
            description={banner.description as string}
            link={
              banner.link && banner.linkTitle
                ? {
                    href: banner.link.slug,
                    title: banner.linkTitle,
                  }
                : undefined
            }
            variant={banner.bannerVariant as AlertBannerVariants}
            dismissable={banner.isDismissable}
            onDismiss={() => {
              if (banner.dismissedForDays !== 0) {
                Cookies.set(banner.bannerId, 'hide', {
                  expires: banner.dismissedForDays,
                })
              }
            }}
          />
        ))}
    </>
  )
}

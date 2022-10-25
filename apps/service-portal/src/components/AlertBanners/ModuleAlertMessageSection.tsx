import { AlertMessage, AlertMessageType, Link } from '@island.is/island-ui/core'
import { useAlertBanners } from './useAlertBanners'

export const ModuleAlertBannerSection = () => {
  const banners = useAlertBanners()

  return (
    <>
      {banners
        .filter((banner) => {
          // Don't show the global banner again
          if (banner.servicePortalPaths?.includes('*')) return false
          for (const path of banner.servicePortalPaths ?? []) {
            if (window.location.href.includes(path as string)) {
              return true
            }
          }
          return false
        })
        .map((banner) => (
          <AlertMessage
            key={banner.bannerId}
            title={banner.title as string}
            message={
              <span>
                {banner.description}
                {banner.description && banner.link && ` `}
                {banner.link && (
                  <Link
                    href={banner.link.slug}
                    color="blue400"
                    underline="small"
                    underlineVisibility="always"
                  >
                    {banner.linkTitle}
                  </Link>
                )}
              </span>
            }
            type={banner.bannerVariant as AlertMessageType}
          />
        ))}
    </>
  )
}

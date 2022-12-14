import {
  AlertMessage,
  AlertMessageType,
  Link,
  Stack,
} from '@island.is/island-ui/core'
import { useAlertBanners } from '../../hooks/useAlertBanners'

export const ModuleAlertBannerSection = () => {
  const banners = useAlertBanners()

  const currentBanners = banners.filter((banner) => {
    // Don't show the global banner again
    if (banner.servicePortalPaths?.includes('*')) return false

    for (const path of banner.servicePortalPaths ?? []) {
      if (window.location.href.includes(path)) {
        return true
      }
    }

    return false
  })

  return (
    <Stack space={2}>
      {currentBanners.map((banner) => (
        <AlertMessage
          key={banner.bannerId}
          title={banner.title ?? undefined}
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
    </Stack>
  )
}

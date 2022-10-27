import {
  AlertMessage,
  AlertMessageType,
  Link,
  Stack,
} from '@island.is/island-ui/core'
import { useAlertBanners } from '@island.is/service-portal/graphql'

export const ModuleAlertBannerSection = () => {
  const banners = useAlertBanners()
  const currentBanners = banners.filter((x) => {
    // Don't show the global banner again
    if (x.servicePortalPaths?.includes('*')) return false
    for (const path of x.servicePortalPaths ?? []) {
      if (window.location.href.includes(path as string)) {
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
    </Stack>
  )
}

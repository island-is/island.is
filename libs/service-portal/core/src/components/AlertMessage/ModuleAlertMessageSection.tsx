import {
  AlertMessage,
  AlertMessageType,
  Link,
  Stack,
} from '@island.is/island-ui/core'
import { useAlertBanners } from '@island.is/service-portal/graphql'

export const ModuleAlertBannerSection = () => {
  const path = window.location.pathname
  const banners = useAlertBanners()
  const currentBanners = banners.filter((x) =>
    x.servicePortalPaths?.find((pathname) => path.includes(pathname)),
  )
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

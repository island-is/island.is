import { FC } from 'react'
import Cookies from 'js-cookie'
import {
  AlertBanner,
  AlertBannerVariants,
  Stack,
} from '@island.is/island-ui/core'
import { coreMessages } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { ApplicationTypeBanner } from '../hooks/useApplicationTypeSettings'

export const ApplicationTypeBanners: FC<{
  banners: ApplicationTypeBanner[]
}> = ({ banners }) => {
  const { formatMessage } = useLocale()

  const visibleBanners = banners.filter(
    (banner) => !Cookies.get(banner.bannerId),
  )

  if (visibleBanners.length === 0) {
    return null
  }

  return (
    <Stack space={1}>
      {visibleBanners.map((banner) => (
        <AlertBanner
          key={banner.bannerId}
          title={banner.title ?? undefined}
          description={banner.description ?? undefined}
          variant={banner.bannerVariant as AlertBannerVariants}
          dismissable={banner.isDismissable}
          closeButtonLabel={formatMessage(coreMessages.alertBannerCloseLabel)}
          onDismiss={() => {
            if (banner.dismissedForDays !== 0) {
              Cookies.set(banner.bannerId, 'hide', {
                expires: banner.dismissedForDays,
              })
            }
          }}
          link={
            banner.link?.slug && banner.linkTitle
              ? { href: banner.link.slug, title: banner.linkTitle }
              : undefined
          }
        />
      ))}
    </Stack>
  )
}

import Cookies from 'js-cookie'
import { AlertBanner, Box, Stack } from '@island.is/island-ui/core'
import { AlertBannerVariants } from '@island.is/island-ui/core'
import { AlertBannerType } from '@island.is/portals/my-pages/graphql'
import { forwardRef } from 'react'
import * as styles from './Banners.css'

interface Props {
  banners: AlertBannerType[]
}
export const GlobalAlertBannerSection = forwardRef<HTMLElement, Props>(
  ({ banners }, ref) => {
    return (
      <Box position="fixed" ref={ref} width="full" className={styles.container}>
        <Stack space={banners.length > 0 ? 1 : 0}>
          {banners.map((banner) => (
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
        </Stack>
      </Box>
    )
  },
)

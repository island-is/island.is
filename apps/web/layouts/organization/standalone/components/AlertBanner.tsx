import Cookies from 'js-cookie'

import { AlertBanner, AlertBannerVariants } from '@island.is/island-ui/core'
import { stringHash } from '@island.is/shared/utils'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { linkResolver, LinkType } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

interface StandaloneAlertBannerProps {
  alertBanner: OrganizationPage['alertBanner'] | null | undefined
}

export const StandaloneAlertBanner = ({
  alertBanner,
}: StandaloneAlertBannerProps) => {
  const { activeLocale } = useI18n()

  if (!alertBanner) {
    return null
  }

  const bannerId = `standalone-alert-${stringHash(
    JSON.stringify(alertBanner ?? {}),
  )}`

  if (Cookies.get(bannerId) || !alertBanner.showAlertBanner) {
    return null
  }

  return (
    <AlertBanner
      title={alertBanner.title ?? undefined}
      description={alertBanner.description ?? undefined}
      variant={alertBanner.bannerVariant as AlertBannerVariants}
      dismissable={alertBanner.isDismissable}
      onDismiss={() => {
        if (alertBanner.dismissedForDays !== 0) {
          Cookies.set(bannerId, 'hide', {
            expires: alertBanner.dismissedForDays,
          })
        }
      }}
      closeButtonLabel={activeLocale === 'is' ? 'Loka' : 'Close'}
      link={
        alertBanner.linkTitle && alertBanner.link?.type && alertBanner.link.slug
          ? {
              href: linkResolver(alertBanner.link.type as LinkType, [
                alertBanner.link.slug,
              ]).href,
              title: alertBanner.linkTitle,
            }
          : undefined
      }
    />
  )
}

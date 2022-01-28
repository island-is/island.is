import React from 'react'
import { AlertBanner, AlertBannerVariants } from '@island.is/island-ui/core'
import {
  AlertBanner as AlertBannerSchema,
  OrganizationPage,
} from '@island.is/web/graphql/schema'
import { linkResolver, LinkType } from '@island.is/web/hooks'
import { stringHash } from '@island.is/web/utils/stringHash'
import Cookies from 'js-cookie'

interface OrganizationAlertProps {
  alertBanner: AlertBannerSchema
  organizationPage: OrganizationPage
}

export const OrganizationAlert = ({ alertBanner }: OrganizationAlertProps) => {
  const alertBannerId = `alert-${stringHash(JSON.stringify(alertBanner))}`

  const shouldShowAlert =
    !Cookies.get(alertBannerId) && alertBanner.showAlertBanner

  if (!shouldShowAlert) return null

  const link = {
    ...(!!alertBanner.link &&
      !!alertBanner.linkTitle && {
        href: linkResolver(alertBanner.link.type as LinkType, [
          alertBanner.link.slug,
        ]).href,
        title: alertBanner.linkTitle,
      }),
  }

  const handleDismiss = () => {
    if (alertBanner.dismissedForDays === 0) return
    Cookies.set(alertBannerId, 'hide', {
      expires: alertBanner.dismissedForDays,
    })
  }

  return (
    <AlertBanner
      title={alertBanner.title}
      description={alertBanner.description}
      link={link}
      variant={alertBanner.bannerVariant as AlertBannerVariants}
      dismissable={alertBanner.isDismissable}
      onDismiss={handleDismiss}
    />
  )
}

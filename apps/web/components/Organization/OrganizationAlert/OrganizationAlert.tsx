import React, { useState } from 'react'
import {
  AlertBanner,
  AlertBannerVariants,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { AlertBanner as AlertBannerSchema } from '@island.is/web/graphql/schema'
import { linkResolver, LinkType } from '@island.is/web/hooks'
import { stringHash } from '@island.is/web/utils/stringHash'
import Cookies from 'js-cookie'

interface OrganizationAlertProps {
  alertBanner: AlertBannerSchema
  centered?: boolean
  marginTop?: ResponsiveSpace
}

interface CenterContainerProps {
  marginTop?: ResponsiveSpace
}

const CenterContainer: React.FC<CenterContainerProps> = ({
  children,
  marginTop,
}) => {
  return (
    <GridContainer>
      <GridRow marginTop={marginTop}>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12', '11/12']}>
          {children}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export const OrganizationAlert = ({
  alertBanner,
  centered,
  marginTop,
}: OrganizationAlertProps) => {
  const alertBannerId = `alert-${stringHash(JSON.stringify(alertBanner))}`
  const [shouldShowAlert, setShouldShowAlert] = useState(
    !Cookies.get(alertBannerId) && alertBanner.showAlertBanner,
  )

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
    setShouldShowAlert(false)
  }

  const bannerComponent = (
    <AlertBanner
      title={alertBanner.title}
      description={alertBanner.description}
      link={link}
      variant={alertBanner.bannerVariant as AlertBannerVariants}
      dismissable={alertBanner.isDismissable}
      onDismiss={handleDismiss}
    />
  )

  return centered ? (
    <CenterContainer marginTop={marginTop}>{bannerComponent}</CenterContainer>
  ) : (
    <Box marginTop={marginTop}>{bannerComponent}</Box>
  )
}

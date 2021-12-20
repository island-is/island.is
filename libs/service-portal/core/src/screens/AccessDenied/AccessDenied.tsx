import React from 'react'
import { m, ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { ErrorScreen } from '../ErrorScreen/ErrorScreen'
import { useLocation } from 'react-router-dom'
import { servicePortalMasterNavigation } from '@island.is/service-portal/core'

export const AccessDenied: ServicePortalModuleComponent = () => {
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const navItem = servicePortalMasterNavigation[0].children?.find(
    (x) => x.path === pathname,
  )
  return (
    <ErrorScreen
      tag={formatMessage(m.accessDenied)}
      tagVariant="red"
      title={
        (navItem && formatMessage(navItem?.name)) ||
        formatMessage(m.accessDenied).toString()
      }
      figure="./assets/images/hourglass.svg"
    >
      {formatMessage(m.accessDeniedText)}
    </ErrorScreen>
  )
}

export default AccessDenied

import React from 'react'
import { useLocation } from 'react-router-dom'

import { useLocale } from '@island.is/localization'
import { m, ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { servicePortalMasterNavigation } from '@island.is/service-portal/core'

import { ErrorScreen } from '../ErrorScreen/ErrorScreen'

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

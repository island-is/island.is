import React from 'react'
import { m, ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { ErrorScreen } from '../ErrorScreen/ErrorScreen'
import { useLocation } from 'react-router-dom'
import {
  servicePortalMasterNavigation,
  checkDelegation,
} from '@island.is/service-portal/core'
import { useAuth } from '@island.is/auth/react'

export const AccessDenied: ServicePortalModuleComponent = () => {
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const navItem = servicePortalMasterNavigation[0].children?.find(
    (x) => x.path === pathname,
  )
  const { userInfo: user } = useAuth()

  const isDelegation = user && checkDelegation(user)

  return (
    <ErrorScreen
      tag={
        (navItem && formatMessage(navItem?.name)) ||
        formatMessage(m.accessDenied).toString()
      }
      tagVariant="red"
      title={
        isDelegation
          ? formatMessage(m.accessNeeded)
          : formatMessage(m.accessDenied)
      }
      figure="./assets/images/jobsGrid.svg"
    >
      {isDelegation
        ? formatMessage(m.accessDeniedText)
        : formatMessage(m.accessNeededText)}
    </ErrorScreen>
  )
}

export default AccessDenied

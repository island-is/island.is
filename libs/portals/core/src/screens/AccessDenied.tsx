import { useLocation } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { checkDelegation } from '@island.is/shared/utils'
import { m } from '../lib/messages'
import { PortalModuleComponent } from '../types/portalCore'
import { ErrorScreen } from './ErrorScreen/ErrorScreen'
import { useApp } from '../components/AppProvider'

export const AccessDenied: PortalModuleComponent = () => {
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const { masterNavigation } = useApp()
  const navItem = masterNavigation[0].children?.find((x) => x.path === pathname)
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

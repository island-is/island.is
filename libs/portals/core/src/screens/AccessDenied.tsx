import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { checkDelegation } from '@island.is/shared/utils'
import { m } from '../lib/messages'
import { PortalModuleComponent } from '../types/portalCore'
import { ErrorScreen } from './ErrorScreen/ErrorScreen'

export const AccessDenied: PortalModuleComponent = () => {
  const { formatMessage } = useLocale()
  const { userInfo: user } = useAuth()
  const isDelegation = user && checkDelegation(user)

  return (
    <ErrorScreen
      tag={formatMessage(m.accessDenied).toString()}
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

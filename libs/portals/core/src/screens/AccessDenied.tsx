import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { checkDelegation } from '@island.is/shared/utils'

import { m } from '../lib/messages'
import { Problem } from '@island.is/react-spa/shared'

export const AccessDenied = () => {
  const { formatMessage } = useLocale()
  const { userInfo: user } = useAuth()
  const isDelegation = user && checkDelegation(user)

  return (
    <Problem
      size="large"
      noBorder={false}
      tag={formatMessage(m.accessDenied)}
      title={
        isDelegation
          ? formatMessage(m.accessNeeded)
          : formatMessage(m.accessDenied)
      }
      message={
        isDelegation
          ? formatMessage(m.accessDeniedText)
          : formatMessage(m.accessNeededText)
      }
      imgSrc="./assets/images/jobsGrid.svg"
    />
  )
}

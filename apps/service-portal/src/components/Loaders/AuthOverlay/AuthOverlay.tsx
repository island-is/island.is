import React, { FC, ReactElement } from 'react'
import { useAuth } from '@island.is/auth/react'
import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import * as styles from './AuthOverlay.treat'

const AuthOverlay = (): ReactElement | null => {
  const { authState } = useAuth()
  const { formatMessage } = useLocale()

  if (authState === 'switching')
    return (
      <div className={styles.overlay}>
        <Text variant="h2" as="h2">
          {formatMessage({
            defaultMessage: 'Skipti um notanda',
            description: 'Shown in overlay while switching between delegations',
            id: 'service.portal:switchUser',
          })}
        </Text>
      </div>
    )
  else if (authState === 'logging-out')
    return (
      <div className={styles.overlay}>
        <Text variant="h2" as="h2">
          {formatMessage({
            defaultMessage: 'Skrái notanda út',
            description: 'Shown in overlay while signing out',
            id: 'service.portal:signingOut',
          })}
        </Text>
      </div>
    )
  return null
}

export default AuthOverlay

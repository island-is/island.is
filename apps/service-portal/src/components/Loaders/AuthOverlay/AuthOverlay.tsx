import { useAuth } from '@island.is/auth/react'
import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'

import * as styles from './AuthOverlay.css'

const AuthOverlay = () => {
  const { authState } = useAuth()
  const { formatMessage } = useLocale()

  if (authState === 'switching')
    return (
      <div className={styles.overlay}>
        <Text variant="h2" as="h2">
          {formatMessage(m.switchUser)}
        </Text>
      </div>
    )
  else if (authState === 'logging-out')
    return (
      <div className={styles.overlay}>
        <Text variant="h2" as="h2">
          {formatMessage(m.signingOut)}
        </Text>
      </div>
    )
  return null
}

export default AuthOverlay

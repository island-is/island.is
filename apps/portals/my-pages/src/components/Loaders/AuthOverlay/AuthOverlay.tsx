import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'

import { useBff } from '@island.is/react-spa/bff'
import * as styles from './AuthOverlay.css'

const AuthOverlay = () => {
  const { authState } = useBff()
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

import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './TransportAuthority.css'

export const TransportAuthority = ({
  namespace,
}: {
  namespace: Record<string, string>
}) => {
  const n = useNamespace(namespace)
  return (
    <Box
      className={styles.bg}
      style={{
        backgroundImage: n(
          'transportAuthorityServiceWebHeaderBackgroundImage',
          'url(https://images.ctfassets.net/8k0h54kbe6bj/4HQGy5lUXf17EEbsgQ6liC/5a37594d436c4ef591dc2723297461a4/Rectangle_713.png)',
        ),
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    />
  )
}

export default TransportAuthority

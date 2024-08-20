import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './Default.css'

interface DefaultProps {
  namespace: Record<string, string>
}

export const Default = ({ namespace }: DefaultProps) => {
  const n = useNamespace(namespace)
  const hasBackgroundConfig = n('serviceWebHeaderBackground', false)

  return (
    <Box
      style={{
        background: n('serviceWebHeaderBackground', theme.color.blueberry100),
      }}
      className={hasBackgroundConfig ? styles.hasBackgroundConfig : styles.bg}
    />
  )
}

export default Default

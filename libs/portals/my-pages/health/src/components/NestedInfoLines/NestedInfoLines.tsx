import { Box, Text } from '@island.is/island-ui/core'
import { NestedLines } from '@island.is/portals/my-pages/core'
import React from 'react'
import * as styles from './NestedInfoLines.css'
interface Props {
  label?: string
  data: {
    title: string
    value?: string | number | React.ReactElement | string[]
    type?: 'text' | 'link' | 'action'
    href?: string
    action?: () => void
  }[]
  width?: 'full' | 'half'
  backgroundColor?: 'blue' | 'white'
}

const NestedInfoLines: React.FC<Props> = ({
  label,
  data,
  width = 'full',
  backgroundColor,
}) => {
  return (
    <Box
      padding={[0, 0, 1, 3]}
      paddingBottom={0}
      background={backgroundColor === 'blue' ? 'blue100' : 'white'}
    >
      {label && (
        <Box className={styles.title} paddingBottom={2}>
          <Text variant="small" fontWeight="medium">
            {label}
          </Text>
        </Box>
      )}
      <NestedLines data={data} width={width} />
    </Box>
  )
}

export default NestedInfoLines

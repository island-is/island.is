import { Box, Text } from '@island.is/island-ui/core'
import { NestedLines } from '@island.is/portals/my-pages/core'
import React from 'react'
import * as styles from './NestedInfoLines.css'
interface Props {
  label?: string
  data: {
    title: string
    value?: string | number | React.ReactElement
    type?: 'text' | 'link'
    href?: string
  }[]
  width?: 'full' | 'half'
}

const NestedInfoLines: React.FC<Props> = ({ label, data, width = 'full' }) => {
  return (
    <Box margin={[0, 0, 1, 3, 3]}>
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

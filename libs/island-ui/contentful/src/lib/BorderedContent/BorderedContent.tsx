import React, { FC, ReactNode } from 'react'
import { Box } from '@island.is/island-ui/core'

import * as styles from './BorderedContent.treat'

interface BorderedContentProps {
  topContent: ReactNode
  bottomContent: ReactNode
  showTopContent?: boolean
}

export const BorderedContent: FC<BorderedContentProps> = ({
  topContent,
  bottomContent,
  showTopContent,
}) => {
  return (
    <div className={styles.container}>
      <Box width="full">
        {showTopContent ? <Box paddingY={[3, 3, 5]}>{topContent}</Box> : null}
        <Box paddingY={[3, 3, 6]} className={styles.bottomContent}>
          {bottomContent}
        </Box>
      </Box>
    </div>
  )
}

export default BorderedContent

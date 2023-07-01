import React, { FC, ReactNode } from 'react'
import { Box } from '@island.is/island-ui/core'

import * as styles from './BorderedContent.css'

export interface BorderedContentProps {
  topContent: ReactNode
  bottomContent: ReactNode
}

export const BorderedContent: FC<
  React.PropsWithChildren<BorderedContentProps>
> = ({ topContent, bottomContent }) => {
  return (
    <div className={styles.container}>
      <Box width="full">
        {topContent && <Box paddingY={[3, 3, 5]}>{topContent}</Box>}
        <Box paddingY={[3, 3, 6]} className={styles.bottomContent}>
          {bottomContent}
        </Box>
      </Box>
    </div>
  )
}

export default BorderedContent

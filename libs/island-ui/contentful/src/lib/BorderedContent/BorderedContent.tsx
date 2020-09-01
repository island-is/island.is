import React, { FC, ReactNode } from 'react'
import {
  ContentBlock,
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

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
        {showTopContent ? (
          <Box paddingTop={[6, 6, 9]} paddingBottom={[3, 3, 5]}>
            {topContent}
          </Box>
        ) : null}
        <Box paddingY={[3, 3, 6]} background="blue100">
          {bottomContent}
        </Box>
      </Box>
    </div>
  )
}

export default BorderedContent

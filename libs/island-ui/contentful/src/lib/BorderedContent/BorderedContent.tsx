import React, { FC, ReactNode } from 'react'
import { ContentBlock, Box } from '@island.is/island-ui/core'

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
      <ContentBlock width="large">
        <Box width="full">
          {showTopContent ? (
            <Box
              paddingX={[3, 3, 6, 3]}
              paddingTop={[6, 6, 9]}
              paddingBottom={[3, 3, 5]}
            >
              {topContent}
            </Box>
          ) : null}
          <Box
            paddingX={[3, 3, 6, 3]}
            paddingY={[3, 3, 6]}
            background="blue100"
          >
            {bottomContent}
          </Box>
        </Box>
      </ContentBlock>
    </div>
  )
}

export default BorderedContent

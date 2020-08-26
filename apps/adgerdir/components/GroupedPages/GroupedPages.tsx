import React, { FC, ReactNode } from 'react'
import { ContentBlock, Box } from '@island.is/island-ui/core'

import * as styles from './GroupedPages.treat'

interface GroupedPagesProps {
  topContent: ReactNode
  bottomContent: ReactNode
}

export const GroupedPages: FC<GroupedPagesProps> = ({
  topContent,
  bottomContent,
}) => {
  return (
    <div className={styles.container}>
      <ContentBlock width="large">
        <Box width="full">
          {topContent ? (
            <Box
              padding={[3, 3, 6, 15]}
              paddingY={[3, 3, 6, 10]}
              className={styles.top}
            >
              {topContent}
            </Box>
          ) : null}
          {bottomContent ? (
            <Box
              padding={[3, 3, 6, 15]}
              paddingY={[3, 3, 6, 10]}
              background="blue100"
              className={styles.bottom}
            >
              {bottomContent}
            </Box>
          ) : null}
        </Box>
      </ContentBlock>
    </div>
  )
}

export default GroupedPages

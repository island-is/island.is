import React, { FC, ReactNode, useContext } from 'react'
import cn from 'classnames'
import { ContentBlock, Box } from '@island.is/island-ui/core'
import { ColorSchemeContext, ColorSchemes } from '@island.is/adgerdir/context'

import * as styles from './GroupedPages.treat'

interface GroupedPagesProps {
  topContent: ReactNode
  bottomContent: ReactNode
  variant?: ColorSchemes
}

export const GroupedPages: FC<GroupedPagesProps> = ({
  topContent,
  bottomContent,
  variant,
}) => {
  const { colorScheme } = useContext(ColorSchemeContext)

  return (
    <div
      className={cn(styles.container, styles.variants[variant || colorScheme])}
    >
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
              paddingX={[3, 3, 6, 15]}
              paddingBottom={[3, 3, 6, 10]}
              paddingTop={0}
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

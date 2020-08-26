import React, { FC, ReactNode, useContext } from 'react'
import cn from 'classnames'
import { ContentBlock, Box } from '@island.is/island-ui/core'
import { ColorSchemeContext } from '@island.is/adgerdir/context'

import * as styles from './GroupedPages.treat'

export type GroupedPagesVariant = 'blue' | 'purple' | 'red'

interface GroupedPagesProps {
  topContent: ReactNode
  bottomContent: ReactNode
  variant?: GroupedPagesVariant
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
              padding={[3, 3, 6, 15]}
              paddingY={[3, 3, 6, 10]}
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

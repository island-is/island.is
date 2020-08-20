import React, { FC, ReactNode } from 'react'
import cn from 'classnames'
import { ContentBlock, Box } from '@island.is/island-ui/core'
import { Sticky } from '../../components'

import * as styles from './Layouts.treat'

interface ArticleProps {
  sidebar: ReactNode
}

export const ArticleLayout: FC<ArticleProps> = ({ sidebar, children }) => (
  <ContentBlock>
    <Box padding={[0, 0, 0, 6]}>
      <div className={cn(styles.layout, styles.reversed)}>
        <div className={styles.desktopSide}>
          <Sticky>{sidebar}</Sticky>
        </div>
        <Box paddingRight={[0, 0, 0, 4]} width="full">
          {children}
        </Box>
      </div>
    </Box>
  </ContentBlock>
)

export default ArticleLayout

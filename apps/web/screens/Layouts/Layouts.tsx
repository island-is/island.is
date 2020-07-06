import React, { FC, ReactNode } from 'react'
import cn from 'classnames'
import { ContentBlock, Box } from '@island.is/island-ui/core'
import { Sticky } from '../../components'

import * as styles from './Layouts.treat'

interface CategoryProps {
  sidebar: ReactNode
  belowContent?: ReactNode
}

export const CategoryLayout: FC<CategoryProps> = ({
  sidebar,
  belowContent,
  children,
}) => (
  <ContentBlock>
    <Box padding={[0, 0, 0, 6]}>
      <div className={styles.layout}>
        <div className={styles.side}>
          <Sticky>{sidebar}</Sticky>
        </div>
        <Box paddingLeft={[0, 0, 0, 4]} width="full">
          <Box padding={[3, 3, 6, 0]}>
            <ContentBlock width="small">{children}</ContentBlock>
          </Box>
          {belowContent && (
            <div className={styles.bg}>
              <Box padding={[3, 3, 6, 0]} paddingTop={[3, 3, 6, 6]}>
                <ContentBlock width="small">{belowContent}</ContentBlock>
              </Box>
            </div>
          )}
        </Box>
      </div>
    </Box>
  </ContentBlock>
)

interface ArticleProps {
  sidebar: ReactNode
}

export const ArticleLayout: FC<ArticleProps> = ({ sidebar, children }) => (
  <ContentBlock>
    <Box padding={[0, 0, 0, 6]}>
      <div className={cn(styles.layout, styles.reversed)}>
        <div className={styles.side}>
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

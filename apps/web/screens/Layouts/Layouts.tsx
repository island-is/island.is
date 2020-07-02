import React, { FC, ReactNode } from 'react'
import cn from 'classnames'
import { ContentBlock, Box } from '@island.is/island-ui/core'
import { Sticky } from '../../components'

import * as styles from './Layouts.treat'

interface CategoryProps {
  topContent: ReactNode
  bottomContent: ReactNode
  sidebar: ReactNode
}

export const CategoryLayout: FC<CategoryProps> = ({
  topContent,
  bottomContent,
  sidebar,
}) => (
  <ContentBlock>
    <Box padding={[0, 0, 0, 6]}>
      <div className={styles.layout}>
        <div className={styles.side}>
          <Sticky>{sidebar}</Sticky>
        </div>
        <Box paddingLeft={[0, 0, 0, 4]} width="full">
          <Box padding={[3, 3, 6, 0]}>
            <ContentBlock width="small">{topContent}</ContentBlock>
          </Box>
          <div className={styles.bg}>
            <Box padding={[3, 3, 6, 0]} paddingTop={[3, 3, 6, 6]}>
              <ContentBlock width="small">{bottomContent}</ContentBlock>
            </Box>
          </div>
        </Box>
      </div>
    </Box>
  </ContentBlock>
)

interface ArticleProps {
  content: ReactNode
  sidebar: ReactNode
}

export const ArticleLayout: FC<ArticleProps> = ({ content, sidebar }) => (
  <ContentBlock>
    <Box padding={[0, 0, 0, 6]}>
      <div className={cn(styles.layout, styles.reversed)}>
        <div className={styles.side}>
          <Sticky>{sidebar}</Sticky>
        </div>
        <Box paddingRight={[0, 0, 0, 4]} width="full">
          {content}
        </Box>
      </div>
    </Box>
  </ContentBlock>
)
export default ArticleLayout

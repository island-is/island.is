import React, { ReactNode } from 'react'
import { Box, ContentBlock, Columns, Column } from '@island.is/island-ui/core'

import * as styles from './HomeLayout.treat';
import cn from 'classnames';

interface PropTypes {
  left: ReactNode
  right?: ReactNode
}

function HomeLayout({ left, right }: PropTypes) {
  return (
    <Box className={cn(styles.layout)} paddingX="gutter">
      <ContentBlock>
        <Columns align="right" space="gutter" collapseBelow="lg">
          <Column width="6/12">{left}</Column>
          <Column width="5/12">
            <Box paddingLeft={[0, 0, 0, 8, 15]} width="full">
              {right}
            </Box>
          </Column>
        </Columns>
      </ContentBlock>
    </Box>
  )
}

export default HomeLayout

import React, { FC } from 'react'
import cn from 'classnames'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

import * as styles from './FeaturedNews.treat'

interface FeaturedNewsProps {}

export const FeaturedNews: FC<FeaturedNewsProps> = ({ children }) => {
  return (
    <div className={cn(styles.container)}>
      <Box paddingX={[3, 3, 6]}>
        <GridContainer>
          <GridRow>
            <GridColumn span={10} offset={1}>
              <img src="/img.jpg" />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </div>
  )
}

export default FeaturedNews

import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { NoChildren } from '@island.is/web/types'

interface SubpageMainProps {
  main: ReactNode
  image?: ReactNode
}

export const SubpageMainContent: FC<SubpageMainProps & NoChildren> = ({
  main,
  image,
}) => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          span={image ? ['12/12', '12/12', '12/12', '8/12'] : '12/12'}
        >
          {main}
        </GridColumn>
        {image && (
          <GridColumn span="4/12" hiddenBelow="lg">
            {image}
          </GridColumn>
        )}
      </GridRow>
    </GridContainer>
  )
}

import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

interface SubpageMainProps {
  main: ReactNode
  image?: ReactNode
}

export const SubpageMainContent: FC<SubpageMainProps> = ({ main, image }) => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={image ? ['12/12', '12/12', '9/12'] : '12/12'}>
          {main}
        </GridColumn>
        {image && (
          <GridColumn span="3/12" hiddenBelow="md">
            {image}
          </GridColumn>
        )}
      </GridRow>
    </GridContainer>
  )
}

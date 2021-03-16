import React, { FC } from 'react'
import {
  GridColumn,
  GridColumnProps,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'

export const Offset: FC<{ by: GridColumnProps['offset'] }> = (props) => (
  <GridContainer>
    <GridRow>
      <GridColumn offset={props.by}>{props.children}</GridColumn>
    </GridRow>
  </GridContainer>
)

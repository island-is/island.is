import React, { ReactNode } from 'react'
import { GridRow, GridColumn, GridContainer } from '@island.is/island-ui/core'

interface PropTypes {
  main: ReactNode
  aside?: ReactNode
}

function Layout({ main, aside }: PropTypes) {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '7/12', '8/12', '9/12']}>
          {main}
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '5/12', '4/12', '3/12']}>
          {aside}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Layout

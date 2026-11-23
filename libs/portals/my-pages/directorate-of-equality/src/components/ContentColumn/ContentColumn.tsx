import { ReactNode } from 'react'

import { GridColumn, GridRow } from '@island.is/island-ui/core'

export const ContentColumn = ({ children }: { children: ReactNode }) => (
  <GridRow>
    <GridColumn span={['12/12', '12/12', '10/12']}>{children}</GridColumn>
  </GridRow>
)

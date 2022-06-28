import React, { FC } from 'react'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
interface Props {
  children?: React.ReactNode
}

const LicenseCards: FC<Props> = ({ children }) => {
  useNamespaces('sp.license')
  return (
    <GridRow>
      <GridColumn span="12/12">
        <Stack space={2}>
          {/* When other licenses are available - map through them */}
          {children}
        </Stack>
      </GridColumn>
    </GridRow>
  )
}

export default LicenseCards

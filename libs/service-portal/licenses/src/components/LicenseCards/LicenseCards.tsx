import React, { FC } from 'react'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { DrivingLicense } from '../DrivingLicense/DrivingLicense'
import { DrivingLicenseType } from '@island.is/service-portal/core'
interface Props {
  data: DrivingLicenseType
}

const LicenseCards: FC<Props> = ({ data }) => {
  return (
    <GridRow>
      <GridColumn span="12/12">
        <Stack space={2}>
          {/* When other licenses are available - map through them */}
          <DrivingLicense
            id={data.id.toString()}
            expireDate={data.gildirTil.toString()}
          />
        </Stack>
      </GridColumn>
    </GridRow>
  )
}

export default LicenseCards

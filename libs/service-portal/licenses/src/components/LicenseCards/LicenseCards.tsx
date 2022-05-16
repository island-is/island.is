import React, { FC } from 'react'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { DrivingLicense } from '../DrivingLicense/DrivingLicense'
import {
  AdrLicenseType,
  DrivingLicenseType,
} from '@island.is/service-portal/core'
import { GenericUserLicenseStatus } from '@island.is/api/schema'

interface LicenseData {
  licenese?: DrivingLicenseType | AdrLicenseType
  status?: GenericUserLicenseStatus
}

interface Props {
  data?: Array<LicenseData>
}

const LicenseCards: FC<Props> = ({ data }) => {
  console.log('cards')
  console.log(data)

  return (
    <GridRow>
      <GridColumn span="12/12">
        <Stack space={2}>
          {/* When other licenses are available - map through them */}
        </Stack>
      </GridColumn>
    </GridRow>
  )
}

export default LicenseCards

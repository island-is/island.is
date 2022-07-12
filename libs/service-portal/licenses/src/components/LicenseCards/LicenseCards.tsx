import React, { FC } from 'react'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import DrivingLicense from '../DrivingLicense/DrivingLicense'
import { DrivingLicenseType } from '@island.is/service-portal/core'
import { GenericUserLicense } from '@island.is/api/schema'
import LicenseCardsDeprecated from './LicenseCardsNotUsed'

interface Props {
  data: GenericUserLicense[]
}

const LicenseCards: FC<Props> = ({ data }) => {
  useNamespaces('sp.license')
  return (
    <GridRow>
      <GridColumn span="12/12">
        <Stack space={2}>
          {/* When other licenses are available - map through them */}
          <LicenseCardsDeprecated />

          {/* <DrivingLicense
            id={data.id.toString()}
            expireDate={data.gildirTil.toString()}
          /> */}
        </Stack>
      </GridColumn>
    </GridRow>
  )
}

export default LicenseCards

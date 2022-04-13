import React, { FC } from 'react'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { DrivingLicense } from '../DrivingLicense/DrivingLicense'
import { DrivingLicenseType } from '@island.is/service-portal/core'
import PassportLicense from '../PassportLicense/PassportLicense'
interface Props {
  drivingLicenseData?: DrivingLicenseType
  passportData?: any
  children?: boolean
}

const LicenseCards: FC<Props> = ({
  drivingLicenseData,
  passportData,
  children = false,
}) => {
  return (
    <GridRow>
      <GridColumn span="12/12">
        <Stack space={2}>
          {/* When other licenses are available - map through them */}
          {drivingLicenseData && (
            <DrivingLicense
              id={drivingLicenseData.id.toString()}
              expireDate={drivingLicenseData.gildirTil.toString()}
            />
          )}
          {passportData && (
            <PassportLicense
              id={passportData.number}
              expireDate={passportData.expirationDate}
              children={children}
            />
          )}
        </Stack>
      </GridColumn>
    </GridRow>
  )
}

export default LicenseCards

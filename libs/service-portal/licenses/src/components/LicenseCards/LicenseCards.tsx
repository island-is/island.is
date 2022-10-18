import React, { FC } from 'react'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import DrivingLicense from '../DrivingLicense/DrivingLicense'
import PassportLicense from '../PassportLicense/PassportLicense'
import { DrivingLicenseType } from '@island.is/service-portal/core'
import { IdentityDocumentModel } from '@island.is/api/schema'

interface Props {
  drivingLicenseData?: DrivingLicenseType
  passportData?: IdentityDocumentModel[]
}

const LicenseCards: FC<Props> = ({ drivingLicenseData, passportData }) => {
  useNamespaces('sp.license')
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
          {passportData?.map((item) => (
            <PassportLicense
              key={item.number}
              id={item.numberWithType}
              expireDate={item.expirationDate}
              isInvalid={item.status === 'INVALID'}
              name={item.verboseType}
            />
          ))}
        </Stack>
      </GridColumn>
    </GridRow>
  )
}

export default LicenseCards

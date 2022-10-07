import React, { FC } from 'react'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import PassportLicense from '../PassportLicense/PassportLicense'
import { IdentityDocumentModel } from '@island.is/api/schema'

interface Props {
  passportData?: IdentityDocumentModel[]
}

const LicenseCards: FC<Props> = ({ passportData }) => {
  useNamespaces('sp.license')
  return (
    <GridRow>
      <GridColumn span="12/12">
        <Stack space={2}>
          {/* When other licenses are available - map through them */}
          {passportData &&
            passportData.map((item) => (
              <PassportLicense
                key={item.number}
                id={item.number}
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

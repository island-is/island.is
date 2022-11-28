import React, { FC } from 'react'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import PassportLicense from '../PassportLicense/PassportLicense'
import { IdentityDocumentModel } from '@island.is/api/schema'

interface Props {
  passportData?: IdentityDocumentModel[]
  name?: string
}

const LicenseCards: FC<Props> = ({ passportData, name }) => {
  useNamespaces('sp.license')
  return (
    <GridRow>
      <GridColumn span="12/12">
        <Stack space={2}>
          {passportData?.map((item) => (
            <PassportLicense
              key={item.number}
              id={item.numberWithType}
              expireDate={item.expirationDate}
              isInvalid={item.status === 'INVALID'}
              name={name || item.verboseType}
            />
          ))}
        </Stack>
      </GridColumn>
    </GridRow>
  )
}

export default LicenseCards

import React, { FC } from 'react'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import PassportLicense from '../PassportLicense/PassportLicense'
import { IdentityDocumentModel } from '@island.is/api/schema'
import SingleLicenseCard from '../SingleLicenseCard/SingleLicenseCard'
import { m } from '../../lib/messages'
import { applyPassport, passportLogo } from '../../lib/constants'

interface Props {
  passportData?: IdentityDocumentModel[]
  name?: boolean
  neverPassport?: boolean
}

const LicenseCards: FC<Props> = ({ passportData, name, neverPassport }) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  return (
    <GridRow>
      <GridColumn span="12/12">
        <Stack space={2}>
          {neverPassport ? (
            <SingleLicenseCard
              title={formatMessage(m.passportCardTitle)}
              subtitle={formatMessage(m.noValidPassport)}
              link={applyPassport}
              img={passportLogo}
              linkText={formatMessage(m.applyFor)}
              background="blue100"
            />
          ) : (
            passportData?.map((item) => (
              <PassportLicense
                key={item.number}
                id={item.numberWithType}
                expireDate={item.expirationDate}
                isInvalid={item.status === 'INVALID'}
                name={
                  item.displayFirstName && item.displayLastName && name
                    ? item.displayFirstName + ' ' + item.displayLastName
                    : item.verboseType
                }
              />
            ))
          )}
        </Stack>
      </GridColumn>
    </GridRow>
  )
}

export default LicenseCards

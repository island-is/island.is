import React, { FC } from 'react'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import PassportLicense from '../PassportLicense/PassportLicense'
import { IdentityDocumentModel } from '@island.is/api/schema'
import SingleLicenseCard from '../SingleLicenseCard/SingleLicenseCard'
import { m } from '../../lib/messages'
import { passportLogo } from '../../lib/constants'
import { capitalizeEveryWord } from '../../utils/capitalize'

interface Props {
  passportData?: IdentityDocumentModel[]
  name?: boolean
  noPassport?: boolean
  title?: string | null
}

const LicenseCards: FC<React.PropsWithChildren<Props>> = ({
  passportData,
  name,
  noPassport,
  title,
}) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  return (
    <GridRow>
      <GridColumn span="12/12">
        <Stack space={2}>
          {noPassport ? (
            <SingleLicenseCard
              title={title || formatMessage(m.passportCardTitle)}
              subtitle={formatMessage(m.noValidPassport)}
              link={formatMessage(m.applyPassportUrl)}
              img={passportLogo}
              linkText={formatMessage(m.applyFor)}
              background="blue100"
            />
          ) : (
            passportData?.map((item, i) => (
              <PassportLicense
                key={`${item.number}-${i}`}
                id={item.numberWithType}
                expireDate={item.expirationDate}
                isInvalid={item.status === 'INVALID'}
                expiresWithinNoticeTime={
                  item.expiresWithinNoticeTime ?? undefined
                }
                name={
                  item.displayFirstName && item.displayLastName && name
                    ? capitalizeEveryWord(
                        item.displayFirstName + ' ' + item.displayLastName,
                      )
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

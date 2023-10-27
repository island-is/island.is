import React, { FC } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  EmptyState,
  CardLoader,
  formatDate,
} from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { GenericLicenseType } from '@island.is/service-portal/graphql'
import {
  GenericUserLicense,
  IdentityDocumentModel,
} from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { getPathFromType, getTitleAndLogo } from '../../utils/dataMapper'

import LicenseCards from '../../components/LicenseCards/LicenseCards'
import { getExpiresIn } from '../../utils/dateUtils'

interface Props {
  isLoading: boolean
  hasData: boolean
  hasError: boolean
  isGenericLicenseEmpty: boolean
  passportData?: IdentityDocumentModel[] | null
  genericLicenses?: GenericUserLicense[]
  hasTab?: boolean
}

export const UserLicenses: FC<React.PropsWithChildren<Props>> = ({
  isLoading,
  hasData,
  hasError,
  isGenericLicenseEmpty,
  passportData,
  genericLicenses,
}) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const currentDate = new Date()

  const getLabel = (
    type: GenericLicenseType | 'Passport',
    isInvalid = false,
    expireDate: string,
  ) => {
    const expiresIn = getExpiresIn(currentDate, new Date(expireDate))

    if (type === 'Passport' && isInvalid) {
      return formatMessage(m.invalid)
    }
    if (expiresIn) {
      return expiresIn.value <= 0
        ? formatMessage(m.isExpired)
        : expiresIn?.key === 'months'
        ? formatMessage(m.expiresIn) +
          ' ' +
          Math.round(expiresIn?.value) +
          ' ' +
          formatMessage(m.months)
        : formatMessage(m.expiresIn) +
          ' ' +
          Math.round(expiresIn?.value) +
          ' ' +
          formatMessage(m.days)
    }
    if (expireDate) {
      return `${formatMessage(m.validUntil)} ${formatDate(expireDate)}`
    }

    return formatMessage(m.isValid)
  }

  return (
    <Box marginTop={[2, 3, 6]}>
      {isLoading && (
        <Box marginBottom={2}>
          <CardLoader />
        </Box>
      )}
      {genericLicenses &&
        !isGenericLicenseEmpty &&
        genericLicenses
          .filter((license) => license.license.status === 'HasLicense')
          .map((license, index) => {
            return (
              <Box marginBottom={3} key={index}>
                <ActionCard
                  image={{
                    type: 'image',
                    url: getTitleAndLogo(license.license.type).logo,
                  }}
                  text={
                    formatMessage(m.licenseNumber) +
                    ': ' +
                    license.payload?.metadata?.licenseNumber
                  }
                  heading={formatMessage(
                    getTitleAndLogo(license.license.type).title,
                  )}
                  cta={{
                    label: formatMessage(m.seeDetails),
                    url: getPathFromType(license.license.type),
                    variant: 'text',
                  }}
                  tag={
                    license.payload?.metadata.expireDate
                      ? {
                          label: getLabel(
                            license.license.type,
                            false,
                            license.payload?.metadata.expireDate,
                          ),
                          variant: license.payload.metadata.expired
                            ? 'red'
                            : 'blue',
                          outlined: false,
                        }
                      : license.payload?.metadata?.expired === true
                      ? {
                          label: formatMessage(m.isExpired),
                          variant: 'red',
                          outlined: false,
                        }
                      : license.payload?.metadata?.expired === false
                      ? {
                          label: formatMessage(m.isValid),
                          variant: 'blue',
                          outlined: false,
                        }
                      : undefined
                  }
                />
              </Box>
            )
          })}
      {passportData && (
        <LicenseCards
          passportData={passportData || undefined}
          noPassport={Array.isArray(passportData) && passportData.length === 0}
        />
      )}

      {!isLoading && !hasError && !hasData && (
        <Box marginTop={[0, 8]}>
          <EmptyState />
        </Box>
      )}
    </Box>
  )
}

export default UserLicenses

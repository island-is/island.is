import React, { useEffect, useState } from 'react'
import { defineMessage } from 'react-intl'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ErrorScreen,
  IntroHeader,
  ServicePortalModuleComponent,
  m as coreMessage,
  ActionCard,
  EmptyState,
  formatDate,
} from '@island.is/service-portal/core'
import { LicenseLoader } from '../../components/LicenseLoader/LicenseLoader'
import { m } from '../../lib/messages'
import { gql, useQuery } from '@apollo/client'
import { Locale } from '@island.is/shared/types'
import {
  usePassport,
  GenericLicenseType,
  GenericUserLicenseFetchStatus,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import { Query } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { useHistory } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import {
  getPathFromProviderId,
  getPathFromType,
  getTitleAndLogo,
} from '../../utils/dataMapper'

import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { FeatureFlagClient } from '@island.is/feature-flags'
import LicenseCards from '../../components/LicenseCards/LicenseCards'
import { getExpiresIn } from '../../utils/dateUtils'

const dataFragment = gql`
  fragment genericLicenseDataFieldFragment on GenericLicenseDataField {
    type
    name
    label
    value
    fields {
      type
      name
      label
      value
      fields {
        type
        name
        label
        value
      }
    }
  }
`

const GenericLicensesQuery = gql`
  query GenericLicensesQuery($input: GetGenericLicensesInput, $locale: String) {
    genericLicenses(input: $input, locale: $locale) {
      nationalId
      license {
        type
        provider {
          id
        }
        pkpass
        pkpassVerify
        timeout
        status
        pkpassStatus
      }
      fetch {
        status
        updated
      }
      payload {
        data {
          ...genericLicenseDataFieldFragment
        }
        rawData
        metadata {
          licenseNumber
          expired
          expireDate
        }
      }
    }
  }
  ${dataFragment}
`

export const LicensesOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')

  const { formatMessage } = useLocale()
  const history = useHistory()
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'
  const currentDate = new Date()

  /**
   * Get all licenses is feature flagged
   * If off, all licenses fetched, if on only drivers license is fetched
   * Please remove all code when fully released.
   */
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const [licenseTypes, setLicenseTypes] = useState<Array<GenericLicenseType>>([
    GenericLicenseType.DriversLicense,
  ])
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `servicePortalFetchAllLicenses`,
        false,
      )
      if (ffEnabled) {
        setLicenseTypes([
          GenericLicenseType.DriversLicense,
          GenericLicenseType.AdrLicense,
          GenericLicenseType.MachineLicense,
          GenericLicenseType.FirearmLicense,
        ])
      }
    }
    isFlagEnabled()
  }, [])

  const { data, loading, error } = useQuery<Query>(GenericLicensesQuery, {
    variables: {
      locale,
      input: {
        includedTypes: licenseTypes,
      },
    },
  })

  const {
    data: passportData,
    loading: passportLoading,
    error: passportError,
  } = usePassport()

  const isLoading = loading || passportLoading
  const hasError = error && passportError
  const hasData = !!(data || passportData)

  const { genericLicenses = [] } = data ?? {}

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

  const isError = genericLicenses?.every(
    (item) => item.fetch.status === GenericUserLicenseFetchStatus.Error,
  )

  const isEmpty = genericLicenses.every((item) => item.payload === null)

  if ((hasError || isError) && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag="500"
        title={formatMessage(coreMessage.somethingWrong)}
        children={formatMessage(coreMessage.errorFetchModule, {
          module: formatMessage(coreMessage.licenses).toLowerCase(),
        })}
      />
    )
  }
  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage(m.title)}
          intro={defineMessage(m.intro)}
        />
      </Box>
      {isLoading && (
        <Box marginBottom={1}>
          <LicenseLoader />
        </Box>
      )}{' '}
      {data &&
        !isEmpty &&
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
                    onClick: () =>
                      history.push(
                        ServicePortalPath.LicensesDetail.replace(
                          ':provider',
                          getPathFromProviderId(license.license.provider.id),
                        ).replace(
                          ':type',
                          getPathFromType(license.license.type),
                        ),
                      ),
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
      {!loading && !error && isEmpty && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}
      {hasData && <LicenseCards passportData={passportData || undefined} />}
      {!isLoading && isEmpty && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}
    </>
  )
}

export default LicensesOverview

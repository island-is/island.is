import React from 'react'
import { defineMessage } from 'react-intl'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  IntroHeader,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { LicenseLoader } from '../../components/LicenseLoader/LicenseLoader'
import { m } from '../../lib/messages'
import { gql, useQuery } from '@apollo/client'
import { Locale } from '@island.is/shared/types'
import {
  GenericLicenseType,
  GenericUserLicenseFetchStatus,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import { Query } from '@island.is/api/schema'
import { Box, ActionCard } from '@island.is/island-ui/core'
import { useHistory } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { getPathFromType, getTitleAndLogo } from '../../utils/dataMapper'

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
        licenseNumber
        expired
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
  const { data, loading, error } = useQuery<Query>(GenericLicensesQuery, {
    variables: {
      locale,
      input: {
        includedTypes: [
          GenericLicenseType.DriversLicense,
          GenericLicenseType.AdrLicense,
          GenericLicenseType.MachineLicense,
        ],
      },
    },
  })
  const { genericLicenses = [] } = data ?? {}

  const isError = genericLicenses?.every(
    (item) => item.fetch.status === GenericUserLicenseFetchStatus.Error,
  )

  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage(m.title)}
          intro={defineMessage(m.intro)}
        />
      </Box>
      {loading && <LicenseLoader />}
      {data &&
        genericLicenses
          .filter((license) => license.license.status === 'HasLicense')
          .map((license, index) => {
            return (
              <Box marginBottom={3} key={index}>
                <ActionCard
                  image={getTitleAndLogo(license.license.type).logo}
                  text={
                    formatMessage(m.licenseNumber) +
                    ': ' +
                    license.payload?.licenseNumber
                  }
                  heading={formatMessage(
                    getTitleAndLogo(license.license.type).title,
                  )}
                  headingVariant="h4"
                  cta={{
                    label: formatMessage(m.seeDetails),
                    onClick: () =>
                      history.push(
                        ServicePortalPath.LicensesDetail.replace(
                          ':type',
                          getPathFromType(license.license.type),
                        ),
                      ),
                    variant: 'text',
                  }}
                  tag={
                    license.payload?.expired === true
                      ? {
                          label: formatMessage(m.isExpired),
                          variant: 'red',
                          outlined: false,
                        }
                      : license.payload?.expired === false
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

      {(error || isError) && !loading && (
        <Box>
          <EmptyState description={m.errorFetch} />
        </Box>
      )}
    </>
  )
}

export default LicensesOverview

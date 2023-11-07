import { defineMessage } from 'react-intl'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ErrorScreen,
  IntroHeader,
  FootNote,
  m as coreMessage,
  ISLAND_SYSLUMENN_ID,
} from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { gql, useQuery } from '@apollo/client'
import { Locale } from '@island.is/shared/types'
import {
  GenericUserLicenseFetchStatus,
  useChildrenPassport,
  useUserProfile,
  GenericLicenseType,
} from '@island.is/service-portal/graphql'
import { Query } from '@island.is/api/schema'
import { Box, Tabs } from '@island.is/island-ui/core'
import { usePassport } from '@island.is/service-portal/graphql'
import UserLicenses from './UserLicenses'
import ChildrenLicenses from './ChildrenLicenses'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useState, useEffect } from 'react'

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

export const LicensesOverview = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'

  const featureFlagClient = useFeatureFlagClient()

  const [includedTypes, setIncludedTypes] = useState([
    GenericLicenseType.DriversLicense,
    GenericLicenseType.AdrLicense,
    GenericLicenseType.MachineLicense,
    GenericLicenseType.FirearmLicense,
    GenericLicenseType.DisabilityLicense,
  ])

  useEffect(() => {
    const checkIncluded = async () => {
      const ehicEnabled = await featureFlagClient.getValue(
        'isEHICCardEnabled',
        false,
      )
      const pcardEnabled = await featureFlagClient.getValue(
        'isPcardEnabled',
        false,
      )

      let included = includedTypes
      if (ehicEnabled) {
        included = [...included, GenericLicenseType.Ehic]
      }

      if (pcardEnabled) {
        included = [...included, GenericLicenseType.PCard]
      }

      setIncludedTypes(included)
    }

    checkIncluded()
  }, [])

  const { data, loading, error } = useQuery<Query>(GenericLicensesQuery, {
    variables: {
      locale,
      input: {
        includedTypes,
      },
    },
  })

  const { genericLicenses = [] } = data ?? {}
  const {
    data: passportData,
    loading: passportLoading,
    error: passportError,
  } = usePassport()

  const { data: childrenData, loading: childrenLoading } = useChildrenPassport()

  const isLoading = loading || passportLoading
  const isGenericLicenseEmpty = genericLicenses.every(
    (item) => item.payload === null,
  )
  const hasData = !!(!isGenericLicenseEmpty || passportData)

  const isError = genericLicenses?.every(
    (item) => item.fetch.status === GenericUserLicenseFetchStatus.Error,
  )
  const hasError = !!(error || isError) && !!passportError

  const hasChildren = !!childrenData?.length

  if (hasError && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(coreMessage.errorTitle)}
        title={formatMessage(coreMessage.somethingWrong)}
        children={formatMessage(coreMessage.errorFetchModule, {
          module: formatMessage(coreMessage.licenses).toLowerCase(),
        })}
      />
    )
  }

  return (
    <>
      <IntroHeader
        title={defineMessage(m.title)}
        intro={defineMessage(m.intro)}
        marginBottom={4}
        serviceProviderID={ISLAND_SYSLUMENN_ID}
        serviceProviderTooltip={formatMessage(coreMessage.licensesTooltip)}
      />
      {hasChildren ? (
        <Box>
          <Tabs
            label={formatMessage(m.seeLicenses)}
            contentBackground="white"
            tabs={[
              {
                label: formatMessage(m.licenseTabPrimary),
                content: (
                  <UserLicenses
                    isLoading={isLoading}
                    hasData={hasData}
                    hasError={hasError}
                    isGenericLicenseEmpty={isGenericLicenseEmpty}
                    passportData={passportData}
                    genericLicenses={genericLicenses}
                  />
                ),
              },
              {
                label: formatMessage(m.licenseTabSecondary),
                content: (
                  <ChildrenLicenses
                    data={childrenData}
                    loading={childrenLoading}
                  />
                ),
              },
            ]}
          />
        </Box>
      ) : (
        <UserLicenses
          isLoading={isLoading}
          hasData={hasData}
          hasError={hasError}
          isGenericLicenseEmpty={isGenericLicenseEmpty}
          passportData={passportData}
          genericLicenses={genericLicenses}
        />
      )}
      <FootNote serviceProviderID={ISLAND_SYSLUMENN_ID} />
    </>
  )
}

export default LicensesOverview

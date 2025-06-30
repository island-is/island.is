import {
  GenericLicenseError,
  GenericLicenseType,
  GenericUserLicense,
} from '@island.is/api/schema'
import { Box, Stack, Tabs, TagVariant } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  IntroWrapper,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'
import { m } from '../../../lib/messages'
import { getPathFromType } from '../../../utils/mapPaths'
import { useGenericLicenseCollectionQuery } from './LicensesOverview.generated'

const BASE_INCLUDED_TYPES = [
  GenericLicenseType.AdrLicense,
  GenericLicenseType.DisabilityLicense,
  GenericLicenseType.DriversLicense,
  GenericLicenseType.Ehic,
  GenericLicenseType.FirearmLicense,
  GenericLicenseType.HuntingLicense,
  GenericLicenseType.MachineLicense,
  GenericLicenseType.PCard,
  GenericLicenseType.Passport,
]

export const LicensesOverviewV2 = () => {
  useNamespaces('sp.license')
  const { formatMessage, lang } = useLocale()

  const [includedTypes, setIncludedTypes] = useState<Array<GenericLicenseType>>(
    [],
  )

  const featureFlagClient = useFeatureFlagClient()
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        Features.isIdentityDocumentEnabled,
        false,
      )
      if (ffEnabled) {
        setIncludedTypes([
          ...BASE_INCLUDED_TYPES,
          GenericLicenseType.IdentityDocument,
        ])
      } else setIncludedTypes(BASE_INCLUDED_TYPES)
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data, loading, error } = useGenericLicenseCollectionQuery({
    variables: {
      locale: lang,
      input: {
        includedTypes,
      },
    },
  })

  const generateLicense = (userLicense: GenericUserLicense, index: number) => {
    const isPayloadEmpty = (userLicense.payload?.data.length ?? 0) <= 0 ?? true
    return (
      <ActionCard
        key={`license-card-${userLicense.payload?.metadata.licenseId}-${index}`}
        image={{
          type: 'image',
          url: userLicense.license.provider.providerLogo ?? undefined,
        }}
        text={userLicense.payload?.metadata?.subtitle ?? ''}
        heading={userLicense.payload?.metadata.name ?? ''}
        headingColor={isPayloadEmpty ? 'currentColor' : undefined}
        borderColor={isPayloadEmpty ? 'blue200' : undefined}
        cta={{
          label:
            userLicense.payload?.metadata.ctaLink?.label ??
            formatMessage(m.seeDetails),
          url:
            userLicense.payload?.metadata.ctaLink?.value ??
            `${getPathFromType(userLicense.license.type)}/${
              userLicense.payload?.metadata.licenseId
            } `,
          variant: 'text',
        }}
        backgroundColor={userLicense.payload?.data?.length ? 'white' : 'blue'}
        tag={{
          label: userLicense.payload?.metadata.displayTag?.text ?? '',
          variant:
            (userLicense.payload?.metadata.displayTag?.color as TagVariant) ??
            '',
          outlined: false,
        }}
      />
    )
  }

  const generateLicenseStack = (data: Array<GenericUserLicense>) => (
    <Box marginTop={[2, 3, 6]}>
      <Stack component="ul" space={3}>
        {data.map((license, index) => generateLicense(license, index))}
      </Stack>
    </Box>
  )

  const errors: Array<GenericLicenseError> =
    data?.genericLicenseCollection?.errors ?? []
  const licenses: Array<GenericUserLicense> =
    data?.genericLicenseCollection?.licenses ?? []

  return (
    <IntroWrapper
      title={formatMessage(m.title)}
      intro={formatMessage(m.intro)}
      marginBottom={4}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}{' '}
      {!error && !loading && !errors?.length && !licenses?.length && (
        <Problem
          type="no_data"
          title={formatMessage(coreMessages.noDataFound)}
          message={formatMessage(coreMessages.noDataFoundDetail)}
          imgSrc="./assets/images/coffee.svg"
          titleSize="h3"
          noBorder={false}
        />
      )}
      {!error && loading && (
        <Box marginTop={6}>
          <CardLoader />
        </Box>
      )}
      {!error &&
      !loading &&
      licenses?.some((license) => license.isOwnerChildOfUser) ? (
        <Box>
          <Tabs
            label={formatMessage(m.seeLicenses)}
            size="xs"
            contentBackground="white"
            tabs={[
              {
                label: formatMessage(m.licenseTabPrimary),
                content: generateLicenseStack(
                  licenses.filter((license) => !license.isOwnerChildOfUser),
                ),
              },
              {
                label: formatMessage(m.licenseTabSecondary),
                content: generateLicenseStack(
                  licenses.filter((license) => license.isOwnerChildOfUser),
                ),
              },
            ]}
          />
        </Box>
      ) : (
        <Stack space={3}>
          {licenses
            .filter((license) => !license.isOwnerChildOfUser)
            .map((license, index) => generateLicense(license, index))}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default LicensesOverviewV2

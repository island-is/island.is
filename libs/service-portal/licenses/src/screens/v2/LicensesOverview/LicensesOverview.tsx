import {
  GenericLicenseType,
  GenericUserLicense,
  GenericLicenseError,
} from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { Locale } from '@island.is/shared/types'
import { useGenericLicenseCollectionQuery } from './LicensesOverview.generated'
import {
  Box,
  Button,
  Inline,
  Stack,
  Tabs,
  TagVariant,
} from '@island.is/island-ui/core'
import {
  ActionCard,
  CardLoader,
  IntroHeader,
  m as coreMessages,
} from '@island.is/service-portal/core'
import { m } from '../../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { getPathFromType } from '../../../utils/mapPaths'
import { useMemo, useState } from 'react'
import { IS_ISO31661_ALPHA_3 } from 'class-validator'

export const LicensesOverviewV2 = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'

  const [tabsNumber, setTabsNumber] = useState(3)

  const includedTypes = [
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

  const { data, loading, error } = useGenericLicenseCollectionQuery({
    variables: {
      locale,
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

  const tabs = useMemo(
    () => [
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
    ],
    [licenses],
  )

  return (
    <>
      <IntroHeader
        title={formatMessage(m.title)}
        intro={formatMessage(m.intro)}
        marginBottom={4}
      />
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
            tabs={tabs.slice(0, tabsNumber)}
          />
        </Box>
      ) : (
        <Stack space={3}>
          {licenses
            .filter((license) => !license.isOwnerChildOfUser)
            .map((license, index) => generateLicense(license, index))}
        </Stack>
      )}
    </>
  )
}

export default LicensesOverviewV2

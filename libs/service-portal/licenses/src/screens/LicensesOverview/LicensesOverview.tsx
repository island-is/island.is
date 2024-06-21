import {
  GenericLicenseType,
  GenericUserLicense,
  GenericUserLicenseError,
} from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { Locale } from '@island.is/shared/types'
import { useGenericLicenseCollectionQuery } from './LicensesOverview.generated'
import {
  AlertMessage,
  Box,
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
import { m } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { getPathFromType } from '../../utils/dataMapper'

export const LicensesOverviewV2 = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile()
  const locale = (userProfile?.locale as Locale) ?? 'is'

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
    return (
      <ActionCard
        key={`license-card-${userLicense.payload?.metadata.licenseId}-${index}`}
        image={{
          type: 'image',
          url: userLicense.license.provider.providerLogo ?? undefined,
        }}
        text={
          userLicense.payload?.metadata?.licenseNumberDisplay ?? 'bengobango'
        }
        heading={userLicense.license.name}
        cta={{
          label: formatMessage(m.seeDetails),
          url: `${getPathFromType(userLicense.license.type)}/${
            userLicense.payload?.metadata.licenseId
          } `,
          variant: 'text',
        }}
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

  const errors: Array<GenericUserLicenseError> =
    data?.genericLicenseCollection?.errors ?? []
  const licenses: Array<GenericUserLicense> =
    data?.genericLicenseCollection?.licenses ?? []

  return (
    <>
      <IntroHeader
        title={formatMessage(coreMessages.licenses)}
        intro={formatMessage(coreMessages.licensesDescription)}
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
            contentBackground="white"
            tabs={[
              {
                label: formatMessage(m.licenseTabPrimary),
                content: licenses
                  .filter((license) => !license.isOwnerChildOfUser)
                  .map((license, index) => generateLicense(license, index)),
              },
              {
                label: formatMessage(m.licenseTabSecondary),
                content: licenses
                  .filter((license) => license.isOwnerChildOfUser)
                  .map((license, index) => generateLicense(license, index)),
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
    </>
  )
}

export default LicensesOverviewV2

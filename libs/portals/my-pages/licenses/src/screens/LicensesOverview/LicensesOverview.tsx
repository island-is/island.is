import {
  GenericLicenseError,
  GenericLicenseType,
  GenericUserLicense,
} from '@island.is/api/schema'
import { Box, Stack, Tabs, TagVariant } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  m as coreMessages,
  ActionCard,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { m } from '../../lib/messages'
import { getPathFromType } from '../../utils/mapPaths'
import { useGenericLicenseCollectionQuery } from './LicensesOverview.generated'
import { useNavigate } from 'react-router-dom'

export const LicensesOverview = () => {
  useNamespaces('sp.license')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()

  const { data, loading, error } = useGenericLicenseCollectionQuery({
    variables: {
      locale: lang,
      input: {
        includedTypes: [
          GenericLicenseType.AdrLicense,
          GenericLicenseType.DisabilityLicense,
          GenericLicenseType.DriversLicense,
          GenericLicenseType.Ehic,
          GenericLicenseType.FirearmLicense,
          GenericLicenseType.HuntingLicense,
          GenericLicenseType.MachineLicense,
          GenericLicenseType.PCard,
          GenericLicenseType.Passport,
          GenericLicenseType.IdentityDocument,
        ],
      },
    },
  })

  const generateLicense = (userLicense: GenericUserLicense, index: number) => {
    const isPayloadEmpty = (userLicense.payload?.data.length || 0) <= 0
    return (
      // TODO: Replace with Island UI Card when it supports images
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
          onClick: () =>
            navigate(
              userLicense.payload?.metadata.ctaLink?.value ??
                `${getPathFromType(userLicense.license.type)}/${
                  userLicense.payload?.metadata.licenseId
                } `,
            ),
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

export default LicensesOverview

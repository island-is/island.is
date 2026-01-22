import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  ActionCard,
  CardLoader,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { useOrganizations } from '@island.is/portals/my-pages/graphql'
import { isDefined } from '@island.is/shared/utils'
import { useMemo } from 'react'
import { useGetOccupationalLicensesQuery } from './OccupationalLicensesOverview.generated'
import {
  OccupationalLicense,
  OccupationalLicenseLicenseType,
  OccupationalLicensesError,
} from '@island.is/api/schema'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { olMessage } from '../../lib/messages'
import { OccupationalLicensesPaths } from '../../lib/paths'
import { getTagProps } from '../../lib/utils'

const mapLicenseTypeToOrganization = (
  type: OccupationalLicenseLicenseType,
): OrganizationSlugType | undefined => {
  switch (type) {
    case OccupationalLicenseLicenseType.EDUCATION:
      return 'midstod-menntunar-og-skolathjonustu'
    case OccupationalLicenseLicenseType.HEALTH_DIRECTORATE:
      return 'landlaeknir'
    case OccupationalLicenseLicenseType.DISTRICT_COMMISSIONERS:
      return 'syslumenn'
    default:
      return undefined
  }
}

const Overview = () => {
  const { data: organizations } = useOrganizations()
  const { formatMessage, formatDateFns, locale } = useLocale()
  useNamespaces('sp.occupational-licenses')

  const { data, loading, error } = useGetOccupationalLicensesQuery({
    variables: { locale },
  })

  const licenses =
    data?.occupationalLicenses?.licenses
      .filter((l) => l.__typename === 'OccupationalLicense')
      .filter(isDefined)
      .map((l) => l as OccupationalLicense) ?? []

  const errors = useMemo(() => {
    return (
      data?.occupationalLicenses?.licenses
        .filter((l) => l.__typename === 'OccupationalLicensesError')
        .filter(isDefined)
        .map((l) => l as OccupationalLicensesError) ?? []
    )
  }, [data?.occupationalLicenses?.licenses])

  const errorString = useMemo(() => {
    return errors
      .map((e) => mapLicenseTypeToOrganization(e.type))
      .map((e) => (organizations ?? []).find((o) => o.slug === e)?.title)
      .filter(isDefined)
      .join(', ')
  }, [errors, organizations])

  return (
    <IntroWrapper
      title={m.occupationalLicenses}
      intro={formatMessage(m.occupationalLicensesDescription)}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && !!errors.length && (
        <AlertMessage
          type="warning"
          title={formatMessage(olMessage.fetchOverviewError)}
          message={formatMessage(olMessage.fetchOverviewErrorDetail, {
            arg: errorString,
          })}
        />
      )}
      {!error && !loading && !errors.length && !licenses.length && (
        <Problem
          type="no_data"
          title={formatMessage(m.noDataFound)}
          message={formatMessage(m.noDataFoundDetail)}
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
      {!error && !loading && !!licenses.length && (
        <Box marginTop={6}>
          <Stack space={2}>
            {licenses.map((license) => {
              const image = organizations.find((o) => o.slug === license.issuer)
                ?.logo?.url

              const { label, variant } = getTagProps(
                license.status,
                formatMessage,
              )

              //TODO: Replace with Island UI Card when it supports images
              return (
                <ActionCard
                  key={license.licenseId}
                  capitalizeHeading={true}
                  heading={license.title ?? ''}
                  text={`${formatMessage(
                    olMessage.dayOfPublication,
                  )}: ${formatDateFns(license.validFrom, 'dd.MM.yyyy')}`}
                  tag={{
                    label,
                    variant,
                    outlined: false,
                  }}
                  cta={{
                    label: formatMessage(m.view),
                    variant: 'text',
                    url: OccupationalLicensesPaths.OccupationalLicensesDetail.replace(
                      ':id',
                      license.licenseId,
                    ),
                  }}
                  image={{
                    type: 'image',
                    url: image,
                  }}
                />
              )
            })}
          </Stack>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default Overview

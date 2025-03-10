import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { CardLoader, IntroWrapper, m } from '@island.is/portals/my-pages/core'
import { useOrganizations } from '@island.is/portals/my-pages/graphql'
import { isDefined } from '@island.is/shared/utils'
import { useMemo } from 'react'
import { LicenceActionCard } from '../../../components/LicenceActionCard'
import { olMessage } from '../../../lib/messages'
import { OccupationalLicensesPaths } from '../../../lib/paths'
import { useGetOccupationalLicensesQuery } from './OccupationalLicensesOverview.generated'
import {
  OccupationalLicenseV2,
  OccupationalLicensesV2Error,
  OccupationalLicenseV2LicenseType,
} from '@island.is/api/schema'
import { OrganizationSlugType } from '@island.is/shared/constants'

const mapLicenseTypeToOrganization = (
  type: OccupationalLicenseV2LicenseType,
): OrganizationSlugType | undefined => {
  switch (type) {
    case OccupationalLicenseV2LicenseType.EDUCATION:
      return 'midstod-menntunar-og-skolathjonustu'
    case OccupationalLicenseV2LicenseType.HEALTH_DIRECTORATE:
      return 'landlaeknir'
    case OccupationalLicenseV2LicenseType.DISTRICT_COMMISSIONERS:
      return 'syslumenn'
    default:
      return undefined
  }
}

const OverviewV2 = () => {
  const { data, loading, error } = useGetOccupationalLicensesQuery()
  const { data: organizations } = useOrganizations()
  const { formatMessage, formatDateFns } = useLocale()
  useNamespaces('sp.occupational-licenses')

  const licenses =
    data?.occupationalLicensesV2?.licenses
      .filter((l) => l.__typename === 'OccupationalLicenseV2')
      .filter(isDefined)
      .map((l) => l as OccupationalLicenseV2) ?? []

  const errors = useMemo(() => {
    return (
      data?.occupationalLicensesV2?.licenses
        .filter((l) => l.__typename === 'OccupationalLicensesV2Error')
        .filter(isDefined)
        .map((l) => l as OccupationalLicensesV2Error) ?? []
    )
  }, [data?.occupationalLicensesV2?.licenses])

  const errorString = useMemo(() => {
    return errors
      .map((e) => mapLicenseTypeToOrganization(e.type))
      .map((e) => (organizations ?? []).find((o) => o.slug === e)?.title)
      .filter(isDefined)
      .join(', ')
  }, [errors, organizations])

  return (
    <IntroWrapper
      title={m.occupationaLicenses}
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
            {licenses.map((license, index) => {
              const image = organizations.find((o) => o.slug === license.issuer)
                ?.logo?.url
              return (
                <LicenceActionCard
                  key={index}
                  title={license.title ?? ''}
                  validFrom={formatDateFns(license.validFrom, 'dd.MM.yyyy')}
                  url={OccupationalLicensesPaths.OccupationalLicensesDetail.replace(
                    ':id',
                    license.licenseId,
                  )}
                  image={image}
                  status={license.status}
                />
              )
            })}
          </Stack>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default OverviewV2

import { useGetOccupationalLicensesQuery } from './OccupationalLicensesOverview.generated'
import { Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroHeader,
  FootNote,
  m,
  ISLAND_SYSLUMENN_SLUG,
} from '@island.is/service-portal/core'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'

import { LicenceActionCard } from '../../components/LicenceActionCard'
import { OccupationalLicensesPaths } from '../../lib/paths'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { Problem } from '@island.is/react-spa/shared'
import { useOrganizations } from '@island.is/service-portal/graphql'
import { useMemo } from 'react'

const OccupationalLicensesOverview = () => {
  const { data, loading, error } = useGetOccupationalLicensesQuery({
    errorPolicy: 'all',
  })
  const { data: organizations } = useOrganizations()
  const { formatMessage, formatDateFns } = useLocale()
  useNamespaces('sp.occupational-licenses')

  const licenses = useMemo(
    () => [
      ...(data?.occupationalLicensesV2?.districtCommissioners ?? []),
      ...(data?.occupationalLicensesV2?.education ?? []),
      ...(data?.occupationalLicensesV2?.health ?? []),
    ],
    [data?.occupationalLicensesV2],
  )

  const generateUrl = (route: string, id: string, type: string) =>
    route
      .replace(':id', id)
      .replace(':type', type.charAt(0).toUpperCase() + type.slice(1))

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.occupationaLicenses}
        intro={formatMessage(m.occupationalLicensesDescription)}
        serviceProviderSlug={'syslumenn'}
        serviceProviderTooltip={formatMessage(m.occupationalLicenseTooltip)}
      />
      {error && !data && !loading && <Problem error={error} noBorder={false} />}

      <Box marginTop={6}>
        {loading && !error && <CardLoader />}
        <Stack space={2}>
          {licenses.map((license, index) => (
            <LicenceActionCard
              key={index}
              title={license.title ?? ''}
              validFrom={formatDateFns(license.validFrom, 'dd.MM.yyyy')}
              url={generateUrl(
                OccupationalLicensesPaths.OccupationalLicensesDetail,
                license.licenseId,
                license.profession,
              )}
              image={getOrganizationLogoUrl(
                license.issuer ?? '',
                organizations,
                120,
              )}
              status={license.status}
            />
          ))}
        </Stack>
      </Box>
      <FootNote
        serviceProviderSlug={ISLAND_SYSLUMENN_SLUG as OrganizationSlugType}
      />
    </Box>
  )
}

export default OccupationalLicensesOverview

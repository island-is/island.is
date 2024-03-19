import { getGraphQLErrorsFromResult } from '@apollo/client/utilities'
import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  CardLoader,
  FootNote,
  IntroHeader,
  m,
  mapGqlErrorPaths,
} from '@island.is/service-portal/core'
import { useOrganizations } from '@island.is/service-portal/graphql'
import { isDefined } from '@island.is/shared/utils'
import { useMemo } from 'react'
import { LicenceActionCard } from '../../components/LicenceActionCard'
import { olMessage } from '../../lib/messages'
import { OccupationalLicensesPaths } from '../../lib/paths'
import { useGetOccupationalLicensesQuery } from './OccupationalLicensesOverview.generated'

export const OccupationalLicensesOverview = () => {
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

  const errorString = useMemo(() => {
    if (error) {
      const errors = mapGqlErrorPaths(error, [
        'education',
        'districtCommissioners',
        'health',
      ])

      return errors
        .map((e) => {
          switch (e) {
            case 'education':
              return formatMessage(olMessage.education)
            case 'districtCommissioners':
              return formatMessage(olMessage.districtCommissioners)
            case 'health':
              return formatMessage(olMessage.health)
            default:
              return undefined
          }
        })
        .filter(isDefined)
        .join(', ')
    }
    return
  }, [formatMessage, error])

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.occupationaLicenses}
        intro={formatMessage(m.occupationalLicensesDescription)}
      />

      {error && !data && !loading && <Problem error={error} noBorder={false} />}
      {error && !loading && data && (
        <AlertMessage
          type="warning"
          title={formatMessage(olMessage.fetchOverviewError)}
          message={formatMessage(olMessage.fetchOverviewErrorDetail, {
            arg: errorString,
          })}
        />
      )}

      <Box marginTop={6}>
        {loading && !error && <CardLoader />}
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
      <FootNote serviceProviderSlug={'syslumenn'} />
    </Box>
  )
}

export default OccupationalLicensesOverview

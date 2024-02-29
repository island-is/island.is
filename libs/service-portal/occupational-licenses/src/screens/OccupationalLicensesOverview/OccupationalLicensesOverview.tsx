import { useGetOccupationalLicensesQuery } from './OccupationalLicensesOverview.generated'
import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroHeader,
  FootNote,
  m,
} from '@island.is/service-portal/core'
import { isDefined } from '@island.is/shared/utils'
import { LicenceActionCard } from '../../components/LicenceActionCard'
import { OccupationalLicensesPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'
import { useOrganizations } from '@island.is/service-portal/graphql'
import { useMemo } from 'react'
import { olMessage } from '../../lib/messages'

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
    const mapPathsToIssuerString = (paths?: Array<string | number>) => {
      const mapPath = (path: string | number) => {
        if (typeof path === 'number') {
          return
        }
        switch (path) {
          case 'education':
            return formatMessage(olMessage.education)
          case 'districtCommissioners':
            return formatMessage(olMessage.districtCommissioners)
          case 'health':
            return formatMessage(olMessage.health)
          default:
            return
        }
      }
      if (!paths) {
        return
      }

      return paths.map((p) => mapPath(p)).filter(isDefined)
    }
    let issuersArray: Array<string> = []
    if (error?.graphQLErrors) {
      error.graphQLErrors.forEach((e) => {
        const paths = e.path ? [...e.path] : []
        const mappedPaths = mapPathsToIssuerString(paths)
        if (mappedPaths) {
          issuersArray = [...issuersArray, ...mappedPaths]
        }
      })
    }
    return issuersArray.join(', ')
  }, [error?.graphQLErrors, formatMessage])

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

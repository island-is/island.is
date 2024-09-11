import { Box, Table as T } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  SAMGONGUSTOFA_SLUG,
  m,
  formatDate,
  LinkButton,
  EmptyTable,
} from '@island.is/service-portal/core'
import { Problem } from '@island.is/react-spa/shared'
import { useGetRequestsStatusQuery } from './VehicleBulkMileageJobOverview.generated'
import { VehiclesBulkMileageRegistrationJob } from '@island.is/api/schema'
import { AssetsPaths } from '../../lib/paths'

const VehicleBulkMileageUploadJobOverview = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetRequestsStatusQuery()

  const jobs: Array<VehiclesBulkMileageRegistrationJob> =
    data?.vehicleBulkMileageRegistrationJobHistory?.history ?? []

  return (
    <Box>
      <IntroHeader
        title={m.vehiclesBulkMileageJobOverview}
        intro={'Hér geturu skoðað allar innsendar magnkílómetraskráningar'}
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      />
      {error && <Problem error={error} noBorder={false} />}
      {!error && (
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{'Verkinnsending'}</T.HeadData>
              <T.HeadData>{'Verkupphaf'}</T.HeadData>
              <T.HeadData>{'Verklok'}</T.HeadData>
              <T.HeadData></T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {jobs.map((j) => (
              <T.Row>
                <T.Data>
                  {j.dateRequested ? formatDate(j.dateRequested) : '-'}
                </T.Data>
                <T.Data>
                  {j.dateStarted ? formatDate(j.dateStarted) : '-'}
                </T.Data>
                <T.Data>
                  {j.dateFinished ? formatDate(j.dateFinished) : '-'}
                </T.Data>

                <T.Data>
                  <LinkButton
                    disabled={!j.guid}
                    to={AssetsPaths.AssetsVehiclesBulkMileageJobDetail.replace(
                      ':id',
                      j.guid,
                    )}
                    text={'Skoða verk'}
                    variant="text"
                  />
                </T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      )}
      {!error && (loading || !jobs.length) && (
        <EmptyTable loading={loading} message={'Engin verk fundust'} />
      )}
    </Box>
  )
}

export default VehicleBulkMileageUploadJobOverview

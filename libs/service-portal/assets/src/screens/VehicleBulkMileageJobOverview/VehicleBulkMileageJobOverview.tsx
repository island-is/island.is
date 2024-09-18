import { Box, Table as T, Tag } from '@island.is/island-ui/core'
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
import { vehicleMessage } from '../../lib/messages'

const DATE_FORMAT = 'dd.MM.yyyy - HH:mm'

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
        intro={m.vehiclesBulkMileageJobOverviewDescription}
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      />
      {error && <Problem error={error} noBorder={false} />}
      {!error && (
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                {formatMessage(vehicleMessage.jobSubmitted)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(vehicleMessage.jobStarted)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(vehicleMessage.jobFinished)}
              </T.HeadData>
              <T.HeadData></T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {jobs.map((j) => (
              <T.Row>
                <T.Data>
                  {j.dateRequested
                    ? formatDate(j.dateRequested, DATE_FORMAT)
                    : '-'}
                </T.Data>
                <T.Data>
                  {j.dateStarted ? (
                    formatDate(j.dateStarted, DATE_FORMAT)
                  ) : j.dateRequested ? (
                    <Tag outlined whiteBackground variant="blue">
                      {formatMessage(vehicleMessage.jobNotStarted)}
                    </Tag>
                  ) : (
                    ''
                  )}
                </T.Data>
                <T.Data>
                  {j.dateFinished ? (
                    formatDate(j.dateFinished, DATE_FORMAT)
                  ) : j.dateStarted ? (
                    <Tag outlined whiteBackground variant="blue">
                      {formatMessage(vehicleMessage.jobInProgress)}
                    </Tag>
                  ) : (
                    ''
                  )}
                </T.Data>

                <T.Data>
                  <LinkButton
                    disabled={!j.guid}
                    to={AssetsPaths.AssetsVehiclesBulkMileageJobDetail.replace(
                      ':id',
                      j.guid,
                    )}
                    text={formatMessage(vehicleMessage.goToJob)}
                    variant="text"
                  />
                </T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      )}
      {!error && (loading || !jobs.length) && (
        <EmptyTable
          loading={loading}
          message={formatMessage(vehicleMessage.noJobsFound)}
        />
      )}
    </Box>
  )
}

export default VehicleBulkMileageUploadJobOverview

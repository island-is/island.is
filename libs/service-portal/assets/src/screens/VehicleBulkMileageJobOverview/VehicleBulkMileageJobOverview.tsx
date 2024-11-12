import { Box, Table as T, Tag } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  SAMGONGUSTOFA_SLUG,
  m,
  LinkButton,
  EmptyTable,
  formatDateWithTime,
} from '@island.is/service-portal/core'
import { Problem } from '@island.is/react-spa/shared'
import { useGetRequestsStatusQuery } from './VehicleBulkMileageJobOverview.generated'
import { VehiclesBulkMileageRegistrationJob } from '@island.is/api/schema'
import { AssetsPaths } from '../../lib/paths'
import { vehicleMessage } from '../../lib/messages'
import compareDesc from 'date-fns/compareDesc'

const sortDate = (dateOne?: Date, dateTwo?: Date) => {
  if (!dateOne && !dateTwo) {
    return 0
  } else if (!dateOne) {
    return -1
  } else if (!dateTwo) {
    return 1
  }
  const l = compareDesc(dateOne, dateTwo)
  return l
}

const sortJobs = (
  jobOne: VehiclesBulkMileageRegistrationJob,
  jobTwo: VehiclesBulkMileageRegistrationJob,
) => {
  let sortedValue = 0
  sortedValue = sortDate(
    jobOne.dateFinished ? new Date(jobOne.dateFinished) : undefined,
    jobTwo.dateFinished ? new Date(jobTwo.dateFinished) : undefined,
  )

  if (sortedValue === 0) {
    sortedValue = sortDate(
      jobOne.dateStarted ? new Date(jobOne.dateStarted) : undefined,
      jobTwo.dateStarted ? new Date(jobTwo.dateStarted) : undefined,
    )
  }

  if (sortedValue === 0) {
    sortedValue = sortDate(
      jobOne.dateRequested ? new Date(jobOne.dateRequested) : undefined,
      jobTwo.dateRequested ? new Date(jobTwo.dateRequested) : undefined,
    )
  }

  return sortedValue
}

const VehicleBulkMileageUploadJobOverview = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetRequestsStatusQuery()

  const jobs: Array<VehiclesBulkMileageRegistrationJob> =
    data?.vehicleBulkMileageRegistrationJobHistory?.history ?? []

  const sortedJobs = [...jobs]
  if (sortedJobs.length > 1) {
    sortedJobs.sort((a, b) => sortJobs(a, b))
  }

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
            {sortedJobs.map((j) => (
              <T.Row key={j.guid}>
                <T.Data>
                  {j.dateRequested ? formatDateWithTime(j.dateRequested) : '-'}
                </T.Data>
                <T.Data>
                  {j.dateStarted ? (
                    formatDateWithTime(j.dateStarted)
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
                    formatDateWithTime(j.dateFinished)
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

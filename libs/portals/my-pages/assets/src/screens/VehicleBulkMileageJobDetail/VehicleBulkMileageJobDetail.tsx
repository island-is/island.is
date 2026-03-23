import { Box, Button, Icon, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  SAMGONGUSTOFA_SLUG,
  m,
  EmptyTable,
  TableGrid,
  downloadFile,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { VehiclesBulkMileageRegistrationRequestStatus } from '@island.is/api/schema'
import { useParams } from 'react-router-dom'
import {
  useGetJobRegistrationsQuery,
  useGetJobsStatusQuery,
} from './VehicleBulkMileageJobDetail.generated'
import { VehiclesBulkMileageRegistrationRequestOverview } from '@island.is/portals/my-pages/graphql'
import { displayWithUnit } from '../../utils/displayWithUnit'
import { isDefined } from '@island.is/shared/utils'
import { vehicleMessage } from '../../lib/messages'
import { NetworkStatus } from '@apollo/client'

type UseParams = {
  id: string
}

const VehicleBulkMileageJobDetail = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage, locale } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error, refetch, networkStatus } =
    useGetJobsStatusQuery({
      notifyOnNetworkStatusChange: true,
      variables: {
        input: {
          requestId: id,
        },
      },
    })

  const {
    data: registrationData,
    loading: registrationLoading,
    error: registrationError,
    refetch: registrationRefresh,
    networkStatus: registrationNetworkStatus,
  } = useGetJobRegistrationsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      input: {
        locale: locale,
        guid: id,
      },
    },
  })

  const handleRefresh = () => {
    refetch()
    registrationRefresh()
  }

  const jobsStatus: VehiclesBulkMileageRegistrationRequestStatus | undefined =
    data?.vehicleBulkMileageRegistrationRequestStatus ?? undefined

  const registrations:
    | VehiclesBulkMileageRegistrationRequestOverview
    | undefined =
    registrationData?.vehicleBulkMileageRegistrationRequestOverview ?? undefined

  const handleFileDownload = async () => {
    const requests = registrations?.requests ?? []
    if (!requests.length) {
      return
    }

    const data: Array<Array<string>> = requests
      .filter((r) => !!r.errors?.length)
      .map((erroredVehicle) => {
        if (!erroredVehicle.errors?.length) {
          return null
        }
        return [
          erroredVehicle.vehicleId,
          erroredVehicle.errors.map((j) => j.warningText).join(', '),
        ]
      })
      .filter(isDefined)

    downloadFile(`magnskraning_villur`, ['Ökutæki', 'Villur'], data, 'csv')
  }

  const displayRegistrationData =
    registrations?.requests.length &&
    !registrationLoading &&
    !(registrationNetworkStatus === NetworkStatus.refetch)

  return (
    <IntroWrapper
      title={formatMessage(m.vehiclesBulkMileageJobDetail)}
      introComponent={
        <>
          <Text>{formatMessage(vehicleMessage.dataAboutJob)}</Text>
          <br />
          <Text>{formatMessage(vehicleMessage.refreshDataAboutJob)}</Text>
        </>
      }
      serviceProviderSlug={SAMGONGUSTOFA_SLUG}
      serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      buttonGroup={[
        <Button
          key="refresh-button"
          variant="utility"
          icon={
            loading || networkStatus === NetworkStatus.refetch
              ? undefined
              : 'reload'
          }
          loading={loading || networkStatus === NetworkStatus.refetch}
          onClick={handleRefresh}
        >
          {formatMessage(vehicleMessage.refreshJob)}
        </Button>,
      ]}
    >
      {!error && !loading && !jobsStatus && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(vehicleMessage.noJobFound)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && (
        <Box display="flex" flexDirection="column" rowGap={8}>
          <TableGrid
            title={formatMessage(vehicleMessage.jobStatus)}
            loading={loading || networkStatus === NetworkStatus.refetch}
            emptyMessage={vehicleMessage.noJobsFound}
            dataArray={
              data?.vehicleBulkMileageRegistrationRequestStatus
                ? [
                    [
                      {
                        title: formatMessage(vehicleMessage.totalSubmitted),
                        value: jobsStatus?.jobsSubmitted
                          ? jobsStatus.jobsSubmitted.toString()
                          : '0',
                      },
                      { title: '', value: '' },
                    ],
                    [
                      {
                        title: formatMessage(vehicleMessage.totalFinished),
                        value: jobsStatus?.jobsFinished
                          ? jobsStatus.jobsFinished.toString()
                          : '0',
                      },
                      {
                        title: formatMessage(vehicleMessage.totalRemaining),
                        value: jobsStatus?.jobsRemaining
                          ? jobsStatus.jobsRemaining.toString()
                          : '0',
                      },
                    ],
                    [
                      {
                        title: formatMessage(vehicleMessage.healthyJobs),
                        value: jobsStatus?.jobsValid
                          ? jobsStatus.jobsValid.toString()
                          : '0',
                      },
                      {
                        title: formatMessage(vehicleMessage.unhealthyJobs),
                        value: jobsStatus?.jobsErrored
                          ? jobsStatus.jobsErrored.toString()
                          : '0',
                      },
                    ],
                  ]
                : [[]]
            }
          />

          {registrationError && <Problem error={registrationError} />}
          <Box>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="flexEnd"
              marginBottom={'gutter'}
            >
              <Text fontWeight="semiBold">
                {formatMessage(vehicleMessage.jobsSubmitted)}
              </Text>
              <Button
                colorScheme="default"
                icon="download"
                iconType="outline"
                size="default"
                variant="utility"
                onClick={handleFileDownload}
                disabled={!displayRegistrationData}
              >
                {formatMessage(vehicleMessage.downloadErrors)}
              </Button>
            </Box>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>
                    {formatMessage(vehicleMessage.permno)}
                  </T.HeadData>
                  <T.HeadData>
                    {formatMessage(vehicleMessage.odometer)}
                  </T.HeadData>
                  <T.HeadData>
                    {formatMessage(vehicleMessage.errors)}
                  </T.HeadData>
                </T.Row>
              </T.Head>

              <T.Body>
                {displayRegistrationData
                  ? registrations?.requests.map((j) => (
                      <T.Row key={j.vehicleId}>
                        <T.Data>
                          <Box display="flex" justifyContent="spaceBetween">
                            <Icon
                              icon={
                                j.returnCode !== 'E' ? 'checkmark' : 'warning'
                              }
                              color={
                                j.returnCode !== 'E' ? 'mint400' : 'red400'
                              }
                            />
                            {j.vehicleId}
                          </Box>
                        </T.Data>
                        <T.Data>
                          {displayWithUnit(j.mileage, 'km', true)}
                        </T.Data>
                        <T.Data>
                          {(j.errors ?? [])
                            .map((j) => j.warningText)
                            .join(', ')}
                        </T.Data>
                      </T.Row>
                    ))
                  : null}
              </T.Body>
            </T.Table>
            {!displayRegistrationData && (
              <EmptyTable
                message={formatMessage(vehicleMessage.noRegistrationsFound)}
                loading={
                  registrationLoading ||
                  registrationNetworkStatus === NetworkStatus.refetch
                }
              />
            )}
          </Box>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default VehicleBulkMileageJobDetail

import {
  Box,
  Button,
  Icon,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  SAMGONGUSTOFA_SLUG,
  m,
  EmptyTable,
  TableGrid,
  downloadFile,
} from '@island.is/service-portal/core'
import { Problem } from '@island.is/react-spa/shared'
import { VehiclesBulkMileageRegistrationRequestStatus } from '@island.is/api/schema'
import { useParams } from 'react-router-dom'
import {
  useGetJobRegistrationsQuery,
  useGetJobsStatusQuery,
} from './VehicleBulkMileageJobDetail.generated'
import { VehiclesBulkMileageRegistrationRequestOverview } from '@island.is/service-portal/graphql'
import { displayWithUnit } from '../../utils/displayWithUnit'
import { useMemo } from 'react'
import { isDefined } from '@island.is/shared/utils'
import { vehicleMessage } from '../../lib/messages'

type UseParams = {
  id: string
}

const VehicleBulkMileageUploadJobDetail = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error, refetch } = useGetJobsStatusQuery({
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
  } = useGetJobRegistrationsQuery({
    variables: {
      input: {
        guid: id,
      },
    },
  })

  const jobsStatus: VehiclesBulkMileageRegistrationRequestStatus | undefined =
    data?.vehicleBulkMileageRegistrationRequestStatus ?? undefined

  const registrations:
    | VehiclesBulkMileageRegistrationRequestOverview
    | undefined =
    registrationData?.vehicleBulkMileageRegistrationRequestOverview ?? undefined

  const tableArray = useMemo(() => {
    if (data?.vehicleBulkMileageRegistrationRequestStatus) {
      return [
        [
          {
            title: 'Fjöldi innsendra',
            value: jobsStatus?.jobsSubmitted
              ? jobsStatus.jobsSubmitted.toString()
              : '0',
          },
          { title: '', value: '' },
        ],
        [
          {
            title: 'Fjöldi lokið',
            value: jobsStatus?.jobsFinished
              ? jobsStatus.jobsFinished.toString()
              : '0',
          },
          {
            title: 'Fjöldi eftir',
            value: jobsStatus?.jobsRemaining
              ? jobsStatus.jobsRemaining.toString()
              : '0',
          },
        ],
        [
          {
            title: 'Heilbrigð verk',
            value: jobsStatus?.jobsValid
              ? jobsStatus.jobsValid.toString()
              : '0',
          },
          {
            title: 'Misheppnuð verk',
            value: jobsStatus?.jobsErrored
              ? jobsStatus.jobsErrored.toString()
              : '0',
          },
        ],
      ]
    }
  }, [data?.vehicleBulkMileageRegistrationRequestStatus])

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
          erroredVehicle.errors.map((j) => j.message).join(', '),
        ]
      })
      .filter(isDefined)

    downloadFile(`magnskraning_villur`, ['Ökutæki', 'Villur'], data, 'csv')
  }

  return (
    <Box>
      <IntroHeader
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
      >
        <Box marginTop={'containerGutter'}>
          <Button variant="utility" icon="reload" onClick={() => refetch()}>
            {formatMessage(vehicleMessage.refreshJob)}
          </Button>
        </Box>
      </IntroHeader>
      {!error && !loading && !jobsStatus && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(vehicleMessage.noJobFound)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && (
        <Stack space={8}>
          <TableGrid
            title={formatMessage(vehicleMessage.jobStatus)}
            dataArray={tableArray ?? [[]]}
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
                {!!registrations?.requests.length &&
                  registrations?.requests.map((j) => (
                    <T.Row>
                      <T.Data>
                        <Box display="flex" justifyContent="spaceBetween">
                          <Icon
                            icon={
                              j.returnCode !== 'E' ? 'checkmark' : 'warning'
                            }
                            color={j.returnCode !== 'E' ? 'mint400' : 'red400'}
                          />
                          {j.vehicleId}
                        </Box>
                      </T.Data>
                      <T.Data>{displayWithUnit(j.mileage, 'km', true)}</T.Data>
                      <T.Data>
                        {(j.errors ?? []).map((j) => j.message).join(', ')}
                      </T.Data>
                    </T.Row>
                  ))}
              </T.Body>
            </T.Table>
            {(!registrations || registrationLoading) && (
              <EmptyTable
                message={formatMessage(vehicleMessage.noRegistrationsFound)}
                loading={registrationLoading}
              />
            )}
          </Box>
        </Stack>
      )}
    </Box>
  )
}

export default VehicleBulkMileageUploadJobDetail

import { Box, Table as T } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  SAMGONGUSTOFA_SLUG,
  m,
  InfoLineStack,
  InfoLine,
  EmptyTable,
} from '@island.is/service-portal/core'
import { Problem } from '@island.is/react-spa/shared'
import { VehiclesBulkMileageRegistrationRequestStatus } from '@island.is/api/schema'
import { useParams } from 'react-router-dom'
import {
  useGetJobRegistrationsQuery,
  useGetJobsStatusQuery,
} from './VehicleBulkMileageJobDetail.generated'
import { VehiclesBulkMileageRegistrationRequestOverview } from '@island.is/service-portal/graphql'

type UseParams = {
  id: string
}

const VehicleBulkMileageUploadJobDetail = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetJobsStatusQuery({
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

  return (
    <Box>
      <IntroHeader
        title={m.vehiclesBulkMileageJobDetail}
        intro={'Hér má skoða stöðu runuverks'}
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      />
      {error && <Problem error={error} />}
      {!error && !loading && !jobsStatus && (
        <Problem
          type="no_data"
          noBorder={false}
          title={'Engin runuverk fundust'}
          message={'Ekkert verk hefur verið hafið'}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && (
        <>
          <InfoLineStack label={'Runuverkyfirlit'}>
            <InfoLine
              label={'Fjöldi kláraðra verka'}
              content={
                jobsStatus?.jobsFinished
                  ? jobsStatus.jobsFinished.toString()
                  : '0'
              }
              loading={loading}
            />
            <InfoLine
              label={'Fjöldi verka eftir'}
              content={
                jobsStatus?.jobsRemaining
                  ? jobsStatus.jobsRemaining.toString()
                  : '0'
              }
              loading={loading}
            />
            <InfoLine
              label={'Fjöldi innsendra verka'}
              content={
                jobsStatus?.jobsSubmitted
                  ? jobsStatus.jobsSubmitted.toString()
                  : '0'
              }
              loading={loading}
            />
          </InfoLineStack>
          <InfoLineStack label={'Verkheilsa'}>
            <InfoLine
              label={'Heilbrigð verk'}
              content={
                jobsStatus?.jobsValid ? jobsStatus.jobsValid.toString() : '0'
              }
              loading={loading}
            />
            <InfoLine
              label={'Misheppnuð verk'}
              content={
                jobsStatus?.jobsErrored
                  ? jobsStatus.jobsErrored.toString()
                  : '0'
              }
              loading={loading}
            />
          </InfoLineStack>
          {registrationError && <Problem error={registrationError} />}
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{'Fastanúmer ökutækis'}</T.HeadData>
                <T.HeadData>{'Kílómetrastaða'}</T.HeadData>
                <T.HeadData>{'Villa'}</T.HeadData>
              </T.Row>
            </T.Head>

            <T.Body>
              {!!registrations?.requests.length &&
                registrations?.requests.map((j) => (
                  <T.Row>
                    <T.Data>{j.vehicleId}</T.Data>
                    <T.Data>{j.mileage}</T.Data>
                    <T.Data>
                      {j.errors?.map((j) => j.message).join(', ')}
                    </T.Data>
                  </T.Row>
                ))}
            </T.Body>
          </T.Table>
          {(registrations || registrationLoading) && (
            <EmptyTable
              message={'Engar skráningar fundust'}
              loading={loading}
            />
          )}
        </>
      )}
    </Box>
  )
}

export default VehicleBulkMileageUploadJobDetail

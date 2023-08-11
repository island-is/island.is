import React, { FC, useContext, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'

import {
  Box,
  Bullet,
  BulletList,
  Button,
  Hidden,
  Inline,
  LoadingDots,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import { hasPermission } from '@island.is/skilavottord-web/auth/utils'
import { getYear } from '@island.is/skilavottord-web/utils/dateUtils'
import { UserContext } from '@island.is/skilavottord-web/context'
import {
  ProcessPageLayout,
  NotFound,
  OutlinedError,
  CarDetailsBox,
} from '@island.is/skilavottord-web/components'
import {
  Mutation,
  Query,
  RequestErrors,
  RequestStatus,
  Role,
  RecyclingRequestTypes,
} from '@island.is/skilavottord-web/graphql/schema'

const SkilavottordVehicleReadyToDeregisteredQuery = gql`
  query skilavottordVehicleReadyToDeregisteredQuery($permno: String!) {
    skilavottordVehicleReadyToDeregistered(permno: $permno) {
      vehicleId
      vehicleType
      newregDate
      recyclingRequests {
        nameOfRequestor
      }
    }
  }
`

const SkilavottordRecyclingRequestMutation = gql`
  mutation skilavottordRecyclingRequestMutation(
    $permno: String!
    $requestType: RecyclingRequestTypes!
  ) {
    createSkilavottordRecyclingRequest(
      permno: $permno
      requestType: $requestType
    ) {
      ... on RequestErrors {
        message
        operation
      }
      ... on RequestStatus {
        status
      }
    }
  }
`

const Confirm: FC<React.PropsWithChildren<unknown>> = () => {
  const { user } = useContext(UserContext)
  const {
    t: {
      deregisterVehicle: { deregister: t },
      routes: { deregisterVehicle: routes },
    },
  } = useI18n()
  const router = useRouter()
  const { id } = router.query

  const { data, loading } = useQuery<Query>(
    SkilavottordVehicleReadyToDeregisteredQuery,
    {
      variables: { permno: id },
    },
  )

  const vehicle = data?.skilavottordVehicleReadyToDeregistered

  const [
    setRecyclingRequest,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useMutation<Mutation>(SkilavottordRecyclingRequestMutation, {
    onError() {
      return mutationError
    },
  })

  const mutationResponse = mutationData?.createSkilavottordRecyclingRequest

  useEffect(() => {
    if ((mutationResponse as RequestStatus)?.status) {
      router.replace(routes.baseRoute).then(() => toast.success(t.success))
    }
  }, [mutationResponse, router, routes, t.success])

  const handleConfirm = () => {
    setRecyclingRequest({
      variables: {
        permno: id,
        requestType: RecyclingRequestTypes.deregistered,
      },
    })
  }

  const handleBack = () => {
    router.replace(routes.select)
  }

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    return <NotFound />
  }

  if (
    mutationError ||
    mutationLoading ||
    (mutationResponse as RequestErrors)?.message
  ) {
    return (
      <ProcessPageLayout processType={'company'} activeSection={1}>
        {mutationLoading ? (
          <Box textAlign="center">
            <Stack space={4}>
              <Text variant="h1">{t.titles.loading}</Text>
              <LoadingDots large />
            </Stack>
          </Box>
        ) : (
          <Stack space={4}>
            <Text variant="h1">{t.titles.error}</Text>
            <OutlinedError
              title={t.error.title}
              message={t.error.message}
              primaryButton={{
                text: `${t.error.primaryButton}`,
                action: handleConfirm,
              }}
              secondaryButton={{
                text: `${t.error.secondaryButton}`,
                action: handleBack,
              }}
            />
          </Stack>
        )}
      </ProcessPageLayout>
    )
  }

  return (
    <ProcessPageLayout processType={'company'} activeSection={1}>
      <Stack space={4}>
        {vehicle ? (
          <Stack space={4}>
            <Text variant="h1">{t.titles.success}</Text>
            <Text variant="intro">{t.info.success}</Text>
            <CarDetailsBox
              vehicleId={vehicle.vehicleId}
              vehicleType={vehicle.vehicleType}
              modelYear={getYear(vehicle.newregDate)}
              vehicleOwner={
                vehicle.recyclingRequests &&
                vehicle.recyclingRequests[0].nameOfRequestor
              }
            />
          </Stack>
        ) : (
          <Box>
            {loading ? (
              <Box textAlign="center">
                <LoadingDots large />
              </Box>
            ) : (
              <Stack space={4}>
                <Text variant="h1">{t.titles.notfound}</Text>
                <Inline space={1}>
                  <Text>{t.info.error}</Text>
                  <Text variant="h5">{id}</Text>
                </Inline>
                <BulletList type="ul">
                  <Bullet>
                    {t.info.notfound}
                    <Text variant="h5">skilavottord.island.is/my-cars</Text>
                  </Bullet>
                </BulletList>
              </Stack>
            )}
          </Box>
        )}
        <Box width="full" display="inlineFlex" justifyContent="spaceBetween">
          <Hidden above="sm">
            <Button
              variant="ghost"
              circle
              icon="arrowBack"
              size="large"
              onClick={handleBack}
            />
          </Hidden>
          <Hidden below="md">
            <Button variant="ghost" onClick={handleBack}>
              {t.buttons.back}
            </Button>
          </Hidden>
          {vehicle && (
            <Button onClick={handleConfirm}>{t.buttons.confirm}</Button>
          )}
        </Box>
      </Stack>
    </ProcessPageLayout>
  )
}

export default Confirm

import React, { FC, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import {
  Box,
  Stack,
  Text,
  Button,
  LoadingDots,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  ProcessPageLayout,
  Modal,
  OutlinedError,
} from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'
import { ACCEPTED_TERMS_AND_CONDITION } from '@island.is/skilavottord-web/utils/consts'
import {
  VehicleInformation,
  Mutation,
  RecyclingRequestTypes,
  Query,
  RequestErrors,
} from '@island.is/skilavottord-web/graphql/schema'
import CompanyList from './components/CompanyList'
import * as styles from './Handover.css'

const SkilavottordVehiclesQuery = gql`
  query skilavottordVehiclesQuery {
    skilavottordVehicles {
      permno
      status
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

const Handover: FC<React.PropsWithChildren<unknown>> = () => {
  const { user } = useContext(UserContext)
  const [requestType, setRequestType] = useState<RecyclingRequestTypes>()
  const [isInvalidCar, setInvalidCar] = useState(false)
  const [showModal, setModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  const {
    t: { handover: t, routes },
  } = useI18n()

  const router = useRouter()
  const { id } = router.query

  const { data, loading, error } = useQuery<Query>(SkilavottordVehiclesQuery)

  const cars = data?.skilavottordVehicles || []
  const activeCar = cars.filter(
    (car: VehicleInformation) => car.permno === id,
  )[0]

  const [
    setRecyclingRequest,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useMutation<Mutation>(SkilavottordRecyclingRequestMutation, {
    onError() {
      return mutationError
    },
  })

  const mutationResponse =
    mutationData?.createSkilavottordRecyclingRequest as RequestErrors

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  useEffect(() => {
    // because user can view this page after set pendingRecycle to check the process,
    // don't call setRecyclingRequest if the car has already been set to pendingRecycle
    // and set state invalidCar if activeCar does not exist
    if (activeCar) {
      setInvalidCar(false)
      switch (activeCar.status) {
        case 'inUse':
        case 'cancelled':
          if (
            localStorage.getItem(ACCEPTED_TERMS_AND_CONDITION) ===
            id?.toString()
          ) {
            setRequestType(RecyclingRequestTypes.pendingRecycle)
            setRecyclingRequest({
              variables: {
                permno: id,
                requestType: RecyclingRequestTypes.pendingRecycle,
              },
            })
          } else {
            setInvalidCar(true)
          }
          break
        default:
          break
      }
    } else {
      setInvalidCar(true)
    }
  }, [user, id, activeCar, setRecyclingRequest])

  const routeHome = () => {
    localStorage.clear()
    router.push(`${routes.myCars}`).then(() => window.scrollTo(0, 0))
  }

  const onCancelRecycling = () => {
    setModal(true)
  }

  const onConfirmCancellation = () => {
    setRequestType(RecyclingRequestTypes.cancelled)
    setRecyclingRequest({
      variables: {
        permno: id,
        requestType: RecyclingRequestTypes.cancelled,
      },
    }).then(({ data }) => {
      // setRecyclingRequest is completed with no mutationErrors
      // errors are returned in mutationResponse.message,
      // we must therefore double check for errors in this way before closing modal and routing home
      // current implementation assumes that request can be either RequestErrors or RequestStatus and only
      // RequestErrors has message property and because of that we are asserting it below
      const request = data?.createSkilavottordRecyclingRequest as RequestErrors
      if (!request.message) {
        setModal(false)
        routeHome()
      }
    })
  }

  const onCancelCancellation = () => {
    setModal(false)
  }

  if (
    (requestType !== RecyclingRequestTypes.cancelled &&
      (mutationError || mutationLoading || mutationResponse?.message)) ||
    error ||
    isInvalidCar ||
    (loading && !data)
  ) {
    return (
      <ProcessPageLayout
        processType={'citizen'}
        activeSection={2}
        activeCar={id?.toString()}
      >
        {mutationLoading || loading ? (
          <Box textAlign="center">
            <Stack space={4}>
              <Text variant="h1">{t.titles.loading}</Text>
              <LoadingDots size="large" />
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
                action: () => router.reload(),
              }}
              secondaryButton={{
                text: `${t.error.secondaryButton}`,
                action: () => routeHome(),
              }}
            />
          </Stack>
        )}
      </ProcessPageLayout>
    )
  }

  return (
    <ProcessPageLayout
      processType={'citizen'}
      activeSection={2}
      activeCar={id?.toString()}
    >
      <Stack space={6}>
        <Stack space={2}>
          <Text variant="h1">{t.titles.success}</Text>
          <Text>{t.info}</Text>
        </Stack>
        <Stack space={2}>
          <Text variant="h3">{t.subTitles.nextStep}</Text>
          <Text>{t.subInfo}</Text>
        </Stack>
        <Stack space={[3, 3, 4, 4]}>
          <Text variant="h3">{t.subTitles.companies}</Text>
          <CompanyList />
        </Stack>
      </Stack>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        flexWrap="wrap"
        marginTop={4}
        paddingTop={4}
        borderTopWidth="standard"
        borderColor="purple100"
        borderStyle="solid"
      >
        {isMobile ? (
          <Box paddingBottom={4} className={styles.cancelButtonContainer}>
            <Button
              onClick={onCancelRecycling}
              variant="text"
              colorScheme="destructive"
            >
              {t.buttons.cancel}
            </Button>
          </Box>
        ) : (
          <Button
            onClick={onCancelRecycling}
            variant="ghost"
            colorScheme="destructive"
          >
            {t.buttons.cancel}
          </Button>
        )}
        <Button onClick={routeHome} fluid={isMobile}>
          {t.buttons.close}
        </Button>
      </Box>
      <Modal
        show={showModal}
        onContinue={onConfirmCancellation}
        onCancel={onCancelCancellation}
        title={
          mutationError ? t.cancelModal.titles.error : t.cancelModal.titles.info
        }
        text={t.cancelModal.info}
        continueButtonText={t.cancelModal.buttons.continue}
        cancelButtonText={t.cancelModal.buttons.cancel}
        loading={mutationLoading}
        error={mutationResponse?.message || mutationError}
        errorText={t.cancelModal.error}
      />
    </ProcessPageLayout>
  )
}

export default Handover

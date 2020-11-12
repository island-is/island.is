import React, { FC, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import { useMutation, useQuery } from '@apollo/client'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  Box,
  Stack,
  Text,
  Button,
  LoadingIcon,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  ProcessPageLayout,
  Modal,
  OutlinedError,
} from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'
import { CREATE_RECYCLING_REQUEST_CITIZEN } from '@island.is/skilavottord-web/graphql/mutations'
import { VEHICLES_BY_NATIONAL_ID } from '@island.is/skilavottord-web/graphql/queries'
import CompanyList from './components/CompanyList'
import * as styles from './Handover.treat'
import { ACCEPTED_TERMS_AND_CONDITION } from '@island.is/skilavottord-web/utils/consts'

const Handover: FC = () => {
  const { user } = useContext(UserContext)
  const [requestType, setRequestType] = useState(null)
  const [isInvalidCar, setInvalidCar] = useState(false)
  const [showModal, setModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  const {
    t: { handover: t, routes },
  } = useI18n()

  const router = useRouter()
  const { id } = router.query

  const nationalId = user?.nationalId
  const { data, loading, error } = useQuery(VEHICLES_BY_NATIONAL_ID, {
    variables: { nationalId },
    skip: !nationalId,
  })

  const cars = data?.skilavottordVehicles || []
  const activeCar = cars.filter((car) => car.permno === id)[0]

  const [
    setRecyclingRequest,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useMutation(CREATE_RECYCLING_REQUEST_CITIZEN, {
    onCompleted() {
      if (requestType === 'cancelled') {
        setModal(false)
        routeHome()
      }
    },
    onError() {
      return mutationError
    },
  })

  const mutationResponse = mutationData?.createSkilavottordRecyclingRequest

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
            localStorage.getItem(ACCEPTED_TERMS_AND_CONDITION) === id.toString()
          ) {
            setRequestType('pendingRecycle')
            setRecyclingRequest({
              variables: {
                permno: id,
                nameOfRequestor: user?.name,
                requestType: 'pendingRecycle',
              },
            })
          } else {
            setInvalidCar(true)
          }
        default:
          break
      }
    } else {
      setInvalidCar(true)
    }
  }, [user, id, activeCar])

  const routeHome = () => {
    localStorage.clear()
    router.push(routes.myCars).then(() => window.scrollTo(0, 0))
  }

  const onCancelRecycling = () => {
    setModal(true)
  }

  const onConfirmCancellation = () => {
    setRequestType('cancelled')
    setRecyclingRequest({
      variables: {
        permno: id,
        nameOfRequestor: user?.name,
        requestType: 'cancelled',
      },
    })
  }

  const onCancelCancellation = () => {
    setModal(false)
  }

  if (
    (requestType !== 'cancelled' && (mutationError || mutationLoading)) ||
    error ||
    isInvalidCar ||
    mutationResponse?.message ||
    (loading && !data)
  ) {
    return (
      <ProcessPageLayout
        sectionType={'citizen'}
        activeSection={1}
        activeCar={id.toString()}
      >
        {mutationLoading || loading ? (
          <Box textAlign="center">
            <Stack space={4}>
              <Text variant="h1">{t.titles.loading}</Text>
              <LoadingIcon size={50} />
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
      sectionType={'citizen'}
      activeSection={1}
      activeCar={id.toString()}
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
        <Box display="flex" justifyContent="spaceBetween" flexWrap="wrap">
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
      </Stack>
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
        error={mutationError}
        errorText={t.cancelModal.error}
      />
    </ProcessPageLayout>
  )
}

export default Handover

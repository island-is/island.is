import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import { Box, Stack, Button, Text, toast } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  ProcessPageLayout,
  CarDetailsBox,
} from '@island.is/skilavottord-web/components'
import { formatYear } from '@island.is/skilavottord-web/utils'
import { Mutation } from '@island.is/skilavottord-web/graphql/schema'
import { UserContext } from '@island.is/skilavottord-web/context'
import { dateFormat } from '@island.is/shared/constants'

const SkilavottordVehicleOwnerMutation = gql`
  mutation skilavottordVehicleOwnerMutation($name: String!) {
    createSkilavottordVehicleOwner(name: $name)
  }
`

const SkilavottordVehicleMutation = gql`
  mutation skilavottordVehicleMutation($permno: String!) {
    createSkilavottordVehicle(permno: $permno)
  }
`

interface PropTypes {
  apolloState: any
}

const Confirm = ({ apolloState }: PropTypes) => {
  const { user } = useContext(UserContext)
  const [isTablet, setIsTablet] = useState(false)
  const { width } = useWindowSize()

  const {
    t: { confirm: t, routes },
  } = useI18n()

  const router = useRouter()
  const { id } = router.query

  const car = apolloState[`VehicleInformation:${id}`]

  useEffect(() => {
    if (!car) {
      router.push({
        pathname: `${routes.myCars}`,
      })
    }
  }, [car, router, routes])

  useEffect(() => {
    if (width < theme.breakpoints.lg) {
      return setIsTablet(true)
    }
    setIsTablet(false)
  }, [width])

  const [
    createSkilavottordVehicle,
    { loading: createSkilavottordVehicleLoading },
  ] = useMutation<Mutation>(SkilavottordVehicleMutation)
  const [
    createSkilavottordVehicleOwner,
    { loading: createSkilavottordVehicleOwnerLoading },
  ] = useMutation<Mutation>(SkilavottordVehicleOwnerMutation)

  const loading =
    createSkilavottordVehicleLoading || createSkilavottordVehicleOwnerLoading

  const onCancel = () => {
    router.push(`${routes.recycleVehicle.baseRoute}/${id}/recycle`)
  }

  const onConfirm = async () => {
    const { errors } = await createSkilavottordVehicleOwner({
      variables: {
        name: user?.name,
      },
    })
    if (errors && errors.length > 0) {
      toast.error(errors.join('\n'))
    }

    await createSkilavottordVehicle({
      variables: {
        permno: id,
      },
    })
    router.push(`${routes.recycleVehicle.baseRoute}/${id}/handover`)
  }

  return (
    <>
      {car && (
        <ProcessPageLayout
          processType={'citizen'}
          activeSection={1}
          activeCar={id?.toString()}
        >
          <Stack space={4}>
            <Text variant="h1">{t.title}</Text>
            <Stack space={2}>
              <Text variant="h3">{t.subTitles?.confirm}</Text>
              <Text>{t.info}</Text>
            </Stack>
            <Stack space={2}>
              <CarDetailsBox
                vehicleId={car.permno}
                vehicleType={car.type}
                modelYear={formatYear(car.firstRegDate, dateFormat.is)}
              />
            </Stack>
          </Stack>
          <Box
            marginTop={7}
            paddingTop={4}
            width="full"
            display="inlineFlex"
            justifyContent="spaceBetween"
            borderTopWidth="standard"
            borderColor="purple100"
            borderStyle="solid"
          >
            {isTablet ? (
              <Button
                variant="ghost"
                onClick={onCancel}
                circle
                size="large"
                icon="arrowBack"
              />
            ) : (
              <Button
                variant="ghost"
                onClick={onCancel}
                preTextIcon="arrowBack"
              >
                {t.buttons.cancel}
              </Button>
            )}
            <Button loading={loading} icon="arrowForward" onClick={onConfirm}>
              {t.buttons.continue}
            </Button>
          </Box>
        </ProcessPageLayout>
      )}
    </>
  )
}

export default Confirm

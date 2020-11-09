import React, { FC, useContext } from 'react'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import {
  Box,
  Button,
  Hidden,
  LoadingIcon,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { CarDetailsBox } from '../Confirm/components'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { UserContext } from '@island.is/skilavottord-web/context'
import { NotFound, OutlinedError } from '@island.is/skilavottord-web/components'
import { useMutation } from '@apollo/client'
import { CREATE_RECYCLING_REQUEST } from '@island.is/skilavottord-web/graphql/mutations'

const mockCar = {
  permno: 'ABC123',
  vinNumber: 'ABC123',
  type: 'Volvo',
  firstRegDate: '01-20-2004',
  color: 'red',
  isRecyclable: true,
  status: 'pendingRecycle',
  hasCoOwner: false,
}

const Confirm: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: {
      deregisterVehicle: { deregister: t },
      routes: { deregisterVehicle: routes },
    },
  } = useI18n()
  const router = useRouter()
  const { id } = router.query

  const partnerId = user?.partnerId

  const [
    setRecyclingRequest,
    { error: mutationError, loading: mutationLoading },
  ] = useMutation(CREATE_RECYCLING_REQUEST, {
    onCompleted() {
      router.replace(routes.baseRoute).then(() => toast.success(t.success))
    },
    onError() {
      return mutationError
    },
  })

  const handleConfirm = () => {
    setRecyclingRequest({
      variables: {
        permno: id,
        partnerId: partnerId,
        requestType: 'deregister',
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

  if (mutationError || mutationLoading /* || error || loading */) {
    return (
      <ProcessPageLayout sectionType={'company'} activeSection={1}>
        {mutationLoading ? (
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
    <ProcessPageLayout sectionType={'company'} activeSection={1}>
      <Stack space={4}>
        <Text variant="h1">{t.titles.success}</Text>
        <Text variant="intro">{t.info}</Text>
        <CarDetailsBox car={mockCar} />
        <Box width="full" display="inlineFlex" justifyContent="spaceBetween">
          <Hidden above="md">
            <Button variant="ghost" circle icon="arrowBack" size="large" />
          </Hidden>
          <Hidden below="md">
            <Button variant="ghost" onClick={handleBack}>
              {t.buttons.back}
            </Button>
          </Hidden>
          <Button onClick={handleConfirm}>{t.buttons.confirm}</Button>
        </Box>
      </Stack>
    </ProcessPageLayout>
  )
}

export default Confirm

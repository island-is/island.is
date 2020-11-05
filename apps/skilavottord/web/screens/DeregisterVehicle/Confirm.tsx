import React, { FC, useContext } from 'react'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import {
  Box,
  Button,
  Hidden,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { CarDetailsBox } from '../Confirm/components'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { UserContext } from '@island.is/skilavottord-web/context'
import { NotFound } from '@island.is/skilavottord-web/components'

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

  const mockCar = {
    permno: id.toString(),
    type: 'Volvo',
    firstRegDate: '01-20-2004',
    color: 'red',
    isRecyclable: true,
    status: 'pendingRecycle',
    hasCoOwner: false,
  }

  const handleConfirm = () => {
    router.replace(routes.baseRoute).then(() => toast.success(t.success))
  }

  const handleBack = () => {
    router.replace(routes.select)
  }

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    return <NotFound />
  }

  return (
    <ProcessPageLayout sectionType={'company'} activeSection={1}>
      <Stack space={4}>
        <Text variant="h1">{t.title}</Text>
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

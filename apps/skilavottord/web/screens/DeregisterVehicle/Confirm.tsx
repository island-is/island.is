import React, { FC } from 'react'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import {
  Box,
  Button,
  Hidden,
  IconDeprecated as Icon,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { CarDetailsBox } from '../Confirm/components'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'

const Confirm: FC = () => {
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
    newregdate: '01-20-2004',
    color: 'red',
    recyclable: true,
    status: 'pendingRecycle',
    isCoOwned: false,
  }

  const handleConfirm = () => {
    router.replace(routes.baseRoute)
  }

  const handleBack = () => {
    router.replace(routes.select)
  }

  return (
    <ProcessPageLayout sectionType={'company'} activeSection={1}>
      <Stack space={4}>
        <Text variant="h1">{t.title}</Text>
        <Text variant="intro">{t.info}</Text>
        <CarDetailsBox car={mockCar} />
        <Box width="full" display="inlineFlex" justifyContent="spaceBetween">
          <Hidden above="md">
            <Button variant="ghost" circle size="large">
              <Icon type="arrowLeft" />
            </Button>
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

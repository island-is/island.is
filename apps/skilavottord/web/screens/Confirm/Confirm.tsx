import React, { FC, useState } from 'react'
import {
  Box,
  Stack,
  Typography,
  Button,
  Checkbox,
} from '@island.is/island-ui/core'
import { PageLayout } from '../Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'
import { useRouter } from 'next/router'
import { DetailsBox } from './components'

const mock = {
  id: 'BVZ655',
  model: 'V70',
  brand: 'Volvo',
  year: 2002,
  status: 'enabled',
  hasCoOwner: true,
}

const Confirm: FC = () => {
  const [checkbox, setCheckbox] = useState(false)

  const Router = useRouter()
  const { makePath } = useRouteNames()
  const {
    t: { confirm: t },
  } = useI18n()

  const onCancel = () => {
    Router.push({
      pathname: makePath('myCars'),
    })
  }

  const onContinue = () => {
    console.log('Sign in...')
  }

  return (
    <PageLayout>
      <Stack space={4}>
        <Typography variant="h1">{t.title}</Typography>
        <Stack space={2}>
          <Typography variant="h3">{t.subTitles.confirm}</Typography>
          <Typography variant="intro">{t.info}</Typography>
        </Stack>
        <DetailsBox car={mock} />
        <Checkbox
          name="agree"
          label={t.checkbox.label}
          onChange={({ target }) => {
            setCheckbox(target.checked)
          }}
          checked={checkbox}
        />

        <Box width="full" display="inlineFlex" justifyContent="spaceBetween">
          <Button variant="ghost" onClick={onCancel}>
            {t.buttons.cancel}
          </Button>
          <Button variant="normal">{t.buttons.sign}</Button>
        </Box>
      </Stack>
    </PageLayout>
  )
}

export default Confirm

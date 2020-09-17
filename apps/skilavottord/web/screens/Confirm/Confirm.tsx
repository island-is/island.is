import React, { FC, useState } from 'react'
import {
  Box,
  Stack,
  Typography,
  Button,
  Checkbox,
  Link,
  Icon,
  Inline,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '../Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'
import { useRouter } from 'next/router'
import { CarDetailsBox } from './components'
import OutlinedBox from '@island.is/skilavottord-web/components/OutlinedBox/OutlinedBox'
import * as styles from './Confirm.treat'

const mock = {
  id: 'BVZ655',
  model: 'V70',
  brand: 'Volvo',
  year: 2002,
  status: 'enabled',
  hasCoOwner: true,
}

const Confirm = () => {
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
    Router.push({
      pathname: makePath('recyclingCompanies'),
    })
  }

  const checkboxLabel = (
    <>
      <Inline space={1}>
        {t.checkbox.label}
        <Link
          href=""
          className={
            checkbox
              ? styles.checkboxLabelLinkChecked
              : styles.checkboxLabelLink
          }
        >
          {t.checkbox.linkLabel}
        </Link>
      </Inline>
    </>
  )

  return (
    <ProcessPageLayout>
      <Stack space={4}>
        <Typography variant="h1">{t.title}</Typography>
        <Stack space={2}>
          <Typography variant="h3">{t.subTitles.confirm}</Typography>
          <Typography variant="p">{t.info}</Typography>
        </Stack>
        <Stack space={2}>
          <CarDetailsBox car={mock} />
          <OutlinedBox backgroundColor="blue100" borderColor="white">
            <Box padding={4}>
              <Checkbox
                name="confirm"
                label={checkboxLabel.props.children}
                onChange={({ target }) => {
                  setCheckbox(target.checked)
                }}
                checked={checkbox}
              />
            </Box>
          </OutlinedBox>
        </Stack>
        <Box width="full" display="inlineFlex" justifyContent="spaceBetween">
          <Button variant="ghost" onClick={onCancel}>
            {t.buttons.cancel}
          </Button>
          <Button
            variant="normal"
            disabled={!checkbox}
            onClick={onContinue}
            icon="arrowRight"
          >
            {t.buttons.continue}
          </Button>
        </Box>
      </Stack>
    </ProcessPageLayout>
  )
}

export default Confirm

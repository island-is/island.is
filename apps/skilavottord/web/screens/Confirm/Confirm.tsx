import React, { useState, useEffect } from 'react'
import {
  Box,
  Stack,
  Typography,
  Button,
  Checkbox,
  Inline,
  Link,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'
import { useRouter } from 'next/router'
import { CarDetailsBox } from './components'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import * as styles from './Confirm.treat'

const Confirm = (props) => {
  const { car } = props

  const [checkbox, setCheckbox] = useState(false)

  const {
    t: { confirm: t },
  } = useI18n()
  const { makePath } = useRouteNames()

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (!car) {
      router.push({
        pathname: makePath('myCars'),
      })
    }
  }, [car])

  const onCancel = () => {
    router.push({
      pathname: makePath('myCars'),
    })
  }

  const onConfirm = (id) => {
    // Login with return URL
    // with car info
    // Mutate data on DB
    router.replace(
      '/recycle-vehicle/[id]/handover',
      makePath('recycleVehicle', id, 'handover'),
    )
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
    <>
      {car && (
        <ProcessPageLayout>
          <Stack space={4}>
            <Typography variant="h1">{t.title}</Typography>
            <Stack space={2}>
              <Typography variant="h3">{t.subTitles.confirm}</Typography>
              <Typography variant="p">{t.info}</Typography>
            </Stack>
            <Stack space={2}>
              <CarDetailsBox car={car} />
              <OutlinedBox backgroundColor="blue100" borderColor="white">
                <Box padding={4}>
                  <Checkbox
                    name="confirm"
                    label={checkboxLabel.props.children}
                    onChange={({ target }) => {
                      setCheckbox(target.checked)
                    }}
                    checked={checkbox}
                    disabled={!car.recyclable}
                  />
                </Box>
              </OutlinedBox>
            </Stack>
            <Box
              width="full"
              display="inlineFlex"
              justifyContent="spaceBetween"
            >
              <Button variant="ghost" onClick={onCancel}>
                {t.buttons.cancel}
              </Button>
              <Button
                variant="normal"
                disabled={!checkbox}
                icon="arrowRight"
                onClick={() => onConfirm(id)}
              >
                {t.buttons.continue}
              </Button>
            </Box>
          </Stack>
        </ProcessPageLayout>
      )}
    </>
  )
}

Confirm.getInitialProps = (ctx) => {
  const { apolloClient, query } = ctx
  const {
    cache: {
      data: { data },
    },
  } = apolloClient

  const car = data[`Car:${query.id}`]

  return { car }
}

export default Confirm

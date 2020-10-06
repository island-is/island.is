import React, { useState, useEffect } from 'react'
import {
  Box,
  Stack,
  Typography,
  ButtonDeprecated as Button,
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
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { api } from '@island.is/skilavottord-web/services'

const Confirm = (props) => {
  const [checkbox, setCheckbox] = useState(false)

  const {
    activeLocale,
    t: { confirm: t },
  } = useI18n()
  const { makePath, routePrefix } = useRouteNames(activeLocale)

  const router = useRouter()
  const { id } = router.query

  const { apolloState } = props
  const car = apolloState[`Car:${id}`]

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

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
    api.confirmRecycle(makePath('recycleVehicle', id, 'handover'))

    // router.replace(
    //   `${AUTH_URL}?returnUrl=${makePath('recycleVehicle', id, 'handover')}`,
    // )
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
        <ProcessPageLayout activeSection={0} activeCar={id.toString()}>
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
              {isMobile ? (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  rounded
                  icon="arrowLeft"
                ></Button>
              ) : (
                <Button variant="ghost" onClick={onCancel}>
                  {t.buttons.cancel}
                </Button>
              )}
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

export default Confirm

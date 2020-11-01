import React, { FC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  Box,
  Stack,
  Typography,
  Button,
  Checkbox,
  Text,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { CarDetailsBox } from './components'
import { theme } from '@island.is/island-ui/theme'
import { AUTH_URL } from '@island.is/skilavottord-web/auth/utils'

const Confirm = ({ apolloState }) => {
  const [checkbox, setCheckbox] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
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
        pathname: routes.myCars,
      })
    }
  }, [car])

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const onCancel = () => {
    router.replace({
      pathname: routes.myCars,
    })
  }

  const onConfirm = (id: string) => {
    router.replace(
      `${AUTH_URL['citizen']}/login?returnUrl=${routes.recycleVehicle.baseRoute}/${id}/handover`,
    )
  }

  const checkboxLabel = (
    <>
      <Text fontWeight={!checkbox ? 'light' : 'medium'}>
        {t.checkbox.label} <a href="/">{t.checkbox.linkLabel}</a>
      </Text>
    </>
  )

  return (
    <>
      {car && (
        <ProcessPageLayout
          sectionType={'citizen'}
          activeSection={0}
          activeCar={id.toString()}
        >
          <Stack space={4}>
            <Typography variant="h1">{t.title}</Typography>
            <Stack space={2}>
              <Typography variant="h3">{t.subTitles.confirm}</Typography>
              <Typography variant="p">{t.info}</Typography>
            </Stack>
            <Stack space={2}>
              <CarDetailsBox car={car} />
              <Box padding={4} background="blue100">
                <Checkbox
                  name="confirm"
                  label={checkboxLabel.props.children}
                  onChange={({ target }) => {
                    setCheckbox(target.checked)
                  }}
                  checked={checkbox}
                  disabled={!car.isRecyclable}
                />
              </Box>
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
                  circle
                  size="large"
                  icon="arrowBack"
                />
              ) : (
                <Button variant="ghost" onClick={onCancel}>
                  {t.buttons.cancel}
                </Button>
              )}
              <Button
                disabled={!checkbox}
                icon="arrowForward"
                onClick={() => onConfirm(id.toString())}
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

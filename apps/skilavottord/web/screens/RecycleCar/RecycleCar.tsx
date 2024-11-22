import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'

import { Box, Stack, Button, Checkbox, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  ProcessPageLayout,
  CarDetailsBox,
} from '@island.is/skilavottord-web/components'
import { formatYear } from '@island.is/skilavottord-web/utils'
import { ACCEPTED_TERMS_AND_CONDITION } from '@island.is/skilavottord-web/utils/consts'
import { dateFormat } from '@island.is/shared/constants'

interface PropTypes {
  apolloState: any
}

const RecycleCar = ({ apolloState }: PropTypes) => {
  const router = useRouter()
  const { id } = router.query

  /* const [checkbox, setCheckbox] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const { width } = useWindowSize()

  const {
    t: { recycle: t, routes },
  } = useI18n()


  

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

  const onCancel = () => {
    router.push({
      pathname: routes.myCars,
    })
  }

  const onContinue = async () => {
    localStorage.setItem(ACCEPTED_TERMS_AND_CONDITION, (id || '').toString())
    router.push(`${routes.recycleVehicle.baseRoute}/${id}/confirm`)
  }

  const checkboxLabel = (
    <>
      <Text fontWeight={!checkbox ? 'light' : 'medium'}>
        {t.checkbox!.label}{' '}
        <a href="https://island.is/skilmalar-island-is">
          {t.checkbox!.linkLabel}
        </a>
      </Text>
    </>
  )*/

  return (
    <ProcessPageLayout
      processType={'citizen'}
      activeSection={0}
      activeCar={id?.toString()}
    >
      <h1 style={{ color: 'red' }}>
        Þessu vefsvæði hefur verið lokað!
        <br /> Vinsamlegast notaðu{' '}
        <a href="https://island.is/skilavottord">island.is/skilavottord</a> í
        staðinn.
      </h1>
      <br />
      <h3 style={{ color: 'red' }}>
        This website has been closed!
        <br />
        Please use{' '}
        <a href="https://island.is/skilavottord">island.is/skilavottord</a>{' '}
        instead.
      </h3>
    </ProcessPageLayout>
  )

  /*
  return (
    <>
      {car && ( 
        <ProcessPageLayout
          processType={'citizen'}
          activeSection={0}
          activeCar={id?.toString()}
        >
          

          
          <Stack space={4}>
            <Text variant="h1">{t.title}</Text>
            <Stack space={2}>
              <Text variant="h3">{t.subTitles!.confirm}</Text>
              <Text>{t.info}</Text>
            </Stack>
            <Stack space={2}>
              <CarDetailsBox
                vehicleId={car.permno}
                vehicleType={car.type}
                modelYear={formatYear(car.firstRegDate, dateFormat.is)}
              />
              <Box padding={4} background="blue100" borderRadius="default">
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
              <Button variant="ghost" onClick={onCancel}>
                {t.buttons.cancel}
              </Button>
            )}
            <Button
              disabled={!checkbox}
              icon="arrowForward"
              onClick={onContinue}
            >
              {t.buttons.continue}
            </Button>
          </Box>

            
        </ProcessPageLayout>
      )}
    </>
  )
  */
}

export default RecycleCar

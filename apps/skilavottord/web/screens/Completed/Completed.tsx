import React, { useEffect, useState } from 'react'
import {
  Stack,
  Typography,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
  Link,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '../Layouts'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'
import { CarDetailsBox } from '../Confirm/components'
import OutlinedBox from '@island.is/skilavottord-web/components/OutlinedBox/OutlinedBox'

const Completed = (props) => {
  const { car } = props

  const {
    activeLocale,
    t: { companies: t },
  } = useI18n()
  const { makePath } = useRouteNames(activeLocale)

  const router = useRouter()

  useEffect(() => {
    if (!car) {
      router.push({
        pathname: makePath('myCars'),
      })
    }
  }, [car])

  const onClose = () => {
    router.replace(makePath('myCars'))
  }

  return (
    <>
      {car && (
        <ProcessPageLayout>
          <Stack space={3}>
            <Typography variant="h1">Car has been recycled!</Typography>
            <Stack space={4}>
              <Stack space={2}>
                <Typography variant="h3">Summary</Typography>
                <CarDetailsBox car={car} />
              </Stack>
              <GridContainer>
                <Stack space={4}>
                  <Stack space={2}>
                    <GridRow>
                      <GridColumn span={'6/9'}>
                        <Typography variant="p">
                          Confirmed for recycling by Albert Flores
                        </Typography>
                      </GridColumn>
                      <GridColumn span={'3/9'}>
                        <Typography variant="h5">2019-06-12 00:55</Typography>
                      </GridColumn>
                    </GridRow>
                    <GridRow>
                      <GridColumn span={'6/9'}>
                        <Typography variant="p">
                          Confirmed for recycling by Albert Flores
                        </Typography>
                      </GridColumn>
                      <GridColumn span={'3/9'}>
                        <Typography variant="h5">2019-06-12 00:55</Typography>
                      </GridColumn>
                    </GridRow>
                  </Stack>
                  <OutlinedBox></OutlinedBox>
                  <GridRow>
                    <GridColumn span={'6/9'}>
                      <Typography variant="p">
                        Confirmed for recycling by Albert Flores
                      </Typography>
                    </GridColumn>
                    <GridColumn span={'3/9'}>
                      <Typography variant="h5">2019-06-12 00:55</Typography>
                    </GridColumn>
                    <GridColumn span={'6/9'}>
                      <Typography variant="p">
                        Confirmed for recycling by Albert Flores
                      </Typography>
                    </GridColumn>
                    <GridColumn span={'3/9'}>
                      <Typography variant="h5">2019-06-12 00:55</Typography>
                    </GridColumn>
                  </GridRow>
                </Stack>
              </GridContainer>
              <Stack space={2}>
                <Typography variant="h3">Payment</Typography>
                <Typography variant="p">
                  Money will be payed by Fjársýsla ríkisins to your state
                  collector within 2 days of the payment has been initiated. You
                  will find your payment{' '}
                  <Link href="" color="blue400">
                    your financial pages
                  </Link>
                  .
                </Typography>
              </Stack>
              <Button variant="normal" onClick={onClose}>
                Close
              </Button>
            </Stack>
          </Stack>
        </ProcessPageLayout>
      )}
    </>
  )
}

Completed.getInitialProps = async (ctx) => {
  const { apolloClient, query } = ctx
  const {
    cache: {
      data: { data },
    },
  } = apolloClient

  const car = data[`Car:${query.id}`]

  return { car }
}

export default Completed

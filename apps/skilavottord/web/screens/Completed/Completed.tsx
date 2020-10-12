import React, { useEffect } from 'react'
import {
  Stack,
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
  Link,
  Box,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { CarDetailsBox } from '../Confirm/components'
import { Button } from '@island.is/skilavottord-web/components'

const Completed = ({ apolloState }) => {
  const {
    t: { completed: t, routes },
  } = useI18n()

  const router = useRouter()
  const { id } = router.query

  const car = apolloState[`Car:${id}`]

  useEffect(() => {
    if (!car) {
      router.push({
        pathname: routes.myCars,
      })
    }
  }, [car])

  const onClose = () => {
    router.replace(routes.myCars)
  }

  return (
    <>
      {car && (
        <ProcessPageLayout activeSection={2} activeCar={id.toString()}>
          <Stack space={3}>
            <Typography variant="h1">{t.title}</Typography>
            <Stack space={4}>
              <Stack space={2}>
                <Typography variant="h3">{t.subTitles.summary}</Typography>
                <CarDetailsBox car={car} />
              </Stack>
              <GridContainer>
                <Stack space={4}>
                  <Stack space={2}>
                    <GridRow>
                      <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                        <Typography variant="p">
                          {`${t.confirmedBy.user} Albert Flores`}
                        </Typography>
                      </GridColumn>
                      <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                        <Typography variant="h5">2019-06-12 00:55</Typography>
                      </GridColumn>
                    </GridRow>
                    <GridRow>
                      <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                        <Typography variant="p">
                          {`${t.confirmedBy.user} Albert Flores`}
                        </Typography>
                      </GridColumn>
                      <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                        <Typography variant="h5">2019-06-12 00:55</Typography>
                      </GridColumn>
                    </GridRow>
                  </Stack>
                  <Box borderTopWidth="standard" borderColor="blue200"></Box>
                  <Stack space={1}>
                    <GridRow>
                      <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                        <Typography variant="p">
                          {`${t.confirmedBy.company} VAKA`}
                        </Typography>
                      </GridColumn>
                      <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                        <Typography variant="h5">2019-06-12 00:55</Typography>
                      </GridColumn>
                    </GridRow>
                    <GridRow>
                      <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                        <Typography variant="p">
                          {`${t.confirmedBy.authority}`}
                        </Typography>
                      </GridColumn>
                      <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                        <Typography variant="h5">2019-06-12 00:55</Typography>
                      </GridColumn>
                    </GridRow>
                    <GridRow>
                      <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                        <Typography variant="p">
                          {`${t.confirmedBy.fund}`}
                        </Typography>
                      </GridColumn>
                      <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                        <Typography variant="h5">2019-06-12 00:55</Typography>
                      </GridColumn>
                    </GridRow>
                  </Stack>
                </Stack>
              </GridContainer>
              <Stack space={2}>
                <Typography variant="h3">{t.subTitles.payment}</Typography>

                <Typography variant="p">
                  {t.info.payment}
                  <Link href="" color="blue400">
                    {' '}
                    {t.info.paymentLinkText}
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

export default Completed

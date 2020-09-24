import React, { useEffect } from 'react'
import {
  Stack,
  Typography,
  Button,
  GridContainer,
  GridRow,
  GridColumn,
  Link,
  Box,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'
import { CarDetailsBox } from '../Confirm/components'

const Completed = (props) => {
  const { car } = props

  const {
    activeLocale,
    t: { completed: t },
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
                      <GridColumn span={'6/9'}>
                        <Typography variant="p">
                          {`${t.confirmedBy.user} Albert Flores`}
                        </Typography>
                      </GridColumn>
                      <GridColumn span={'3/9'}>
                        <Typography variant="h5">2019-06-12 00:55</Typography>
                      </GridColumn>
                    </GridRow>
                    <GridRow>
                      <GridColumn span={'6/9'}>
                        <Typography variant="p">
                          {`${t.confirmedBy.user} Albert Flores`}
                        </Typography>
                      </GridColumn>
                      <GridColumn span={'3/9'}>
                        <Typography variant="h5">2019-06-12 00:55</Typography>
                      </GridColumn>
                    </GridRow>
                  </Stack>
                  <Box borderTopWidth="standard" borderColor="blue200"></Box>
                  <Stack space={1}>
                    <GridRow>
                      <GridColumn span={'6/9'}>
                        <Typography variant="p">
                          {`${t.confirmedBy.company} VAKA`}
                        </Typography>
                      </GridColumn>
                      <GridColumn span={'3/9'}>
                        <Typography variant="h5">2019-06-12 00:55</Typography>
                      </GridColumn>
                    </GridRow>
                    <GridRow>
                      <GridColumn span={'6/9'}>
                        <Typography variant="p">
                          {`${t.confirmedBy.authority}`}
                        </Typography>
                      </GridColumn>
                      <GridColumn span={'3/9'}>
                        <Typography variant="h5">2019-06-12 00:55</Typography>
                      </GridColumn>
                    </GridRow>
                    <GridRow>
                      <GridColumn span={'6/9'}>
                        <Typography variant="p">
                          {`${t.confirmedBy.fund}`}
                        </Typography>
                      </GridColumn>
                      <GridColumn span={'3/9'}>
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

Completed.getInitialProps = (ctx) => {
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

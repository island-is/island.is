import React, { useEffect } from 'react'
import {
  Stack,
  GridContainer,
  GridRow,
  GridColumn,
  Text,
  Divider,
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
            <Text variant="h1">{t.title}</Text>
            <Stack space={4}>
              <Stack space={2}>
                <Text variant="h3">{t.subTitles.summary}</Text>
                <CarDetailsBox car={car} />
              </Stack>
              <GridContainer>
                <Stack space={4}>
                  <Stack space={2}>
                    <GridRow>
                      <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                        <Text>{`${t.confirmedBy.user} Albert Flores`}</Text>
                      </GridColumn>
                      <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                        <Text variant="h5">2019-06-12 00:55</Text>
                      </GridColumn>
                    </GridRow>
                    <GridRow>
                      <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                        <Text>{`${t.confirmedBy.user} Albert Flores`}</Text>
                      </GridColumn>
                      <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                        <Text variant="h5">2019-06-12 00:55</Text>
                      </GridColumn>
                    </GridRow>
                  </Stack>
                  <Divider />
                  <Stack space={1}>
                    <GridRow>
                      <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                        <Text>{`${t.confirmedBy.company} VAKA`}</Text>
                      </GridColumn>
                      <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                        <Text variant="h5">2019-06-12 00:55</Text>
                      </GridColumn>
                    </GridRow>
                    <GridRow>
                      <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                        <Text>{`${t.confirmedBy.authority}`}</Text>
                      </GridColumn>
                      <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                        <Text variant="h5">2019-06-12 00:55</Text>
                      </GridColumn>
                    </GridRow>
                    <GridRow>
                      <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                        <Text>{`${t.confirmedBy.fund}`}</Text>
                      </GridColumn>
                      <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                        <Text variant="h5">2019-06-12 00:55</Text>
                      </GridColumn>
                    </GridRow>
                  </Stack>
                </Stack>
              </GridContainer>
              <Stack space={2}>
                <Text variant="h3">{t.subTitles.payment}</Text>
                <Text>
                  {t.info.payment} <a href="/.">{t.info.paymentLinkText}</a>.
                </Text>
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

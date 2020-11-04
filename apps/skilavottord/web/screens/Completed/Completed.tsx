import React, { useContext, useEffect, useState } from 'react'
import {
  Stack,
  GridContainer,
  GridRow,
  GridColumn,
  Text,
  Divider,
  Button,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { CarDetailsBox } from '../Confirm/components'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { REQUEST_TYPES } from '@island.is/skilavottord-web/graphql/queries'
import { useQuery } from '@apollo/client'
import { RecyclingRequestTypes } from '@island.is/skilavottord-web/types'
import { UserContext } from '@island.is/skilavottord-web/context'

const Completed = ({ apolloState }) => {
  const { user } = useContext(UserContext)
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()
  const {
    t: { completed: t, routes },
  } = useI18n()

  const router = useRouter()
  const { id } = router.query

  const { data } = useQuery(REQUEST_TYPES, {
    variables: { permno: id },
  })

  const recyclingRequests = data?.skilavottordRecyclingRequest || []
  const car = apolloState[`VehicleInformation:${id}`]

  useEffect(() => {
    if (!car) {
      router.push({
        pathname: routes.myCars,
      })
    }
  }, [car, router, routes])

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const onClose = () => {
    router.replace(routes.myCars)
  }

  const sortedRequests = recyclingRequests.slice().sort((a, b) => {
    return new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate()
  })

  const userRequests = sortedRequests.filter(
    (request) => request.nameOfRequestor === user?.name,
  )
  const partnerRequests = sortedRequests.filter(
    (request) => request.nameOfRequestor !== user?.name,
  )

  const getConfirmationText = (
    requestType: RecyclingRequestTypes,
    requestor: string,
  ) => {
    switch (requestType) {
      case 'pendingRecycle':
        return `${t.confirmedBy.user} ${requestor}`
      case 'cancelled':
        return `${t.cancelledBy.user} ${requestor}`
      case 'handedOver':
        return `${t.confirmedBy.user} ${requestor}`
      case 'deregistered':
        return t.confirmedBy.authority
      case 'paymentInitiated':
        return t.confirmedBy.fund
      case 'paymentFailed':
        return t.cancelledBy.fund
    }
  }

  const getDate = (dateTime: Date) => {
    const d = new Date(dateTime).toISOString()
    const date = d.split('T')[0]
    return date
  }

  const getTime = (dateTime: Date) => {
    const d = new Date(dateTime).toISOString()
    const time = d.slice(11, 16)
    return time
  }

  return (
    <>
      {car && (
        <ProcessPageLayout
          sectionType={'citizen'}
          activeSection={2}
          activeCar={id.toString()}
        >
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
                    {userRequests.map((request) => (
                      <GridRow>
                        <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                          <Text>
                            {`${getConfirmationText(
                              request.requestType,
                              request.nameOfRequestor,
                            )}`}
                          </Text>
                        </GridColumn>
                        <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                          <Text variant="h5">
                            {`${getDate(new Date(request.createdAt))} ${getTime(
                              new Date(request.createdAt),
                            )}`}
                          </Text>
                        </GridColumn>
                      </GridRow>
                    ))}
                  </Stack>

                  <Divider />
                  <Stack space={2}>
                    {partnerRequests.map((request) => (
                      <GridRow>
                        <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                          <Text>
                            {`${getConfirmationText(
                              request.requestType,
                              request.nameOfRequestor,
                            )}`}
                          </Text>
                        </GridColumn>
                        <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                          <Text variant="h5">
                            {`${getDate(new Date(request.createdAt))} ${getTime(
                              new Date(request.createdAt),
                            )}`}
                          </Text>
                        </GridColumn>
                      </GridRow>
                    ))}
                  </Stack>
                </Stack>
              </GridContainer>
              <Stack space={2}>
                <Text variant="h3">{t.subTitles.payment}</Text>
                <Text>
                  {t.info.payment}{' '}
                  <a href="https://www.fjs.is/">{t.info.paymentLinkText}</a>.
                </Text>
              </Stack>
              <Button onClick={onClose} fluid={isMobile}>
                {t.buttons.close}
              </Button>
            </Stack>
          </Stack>
        </ProcessPageLayout>
      )}
    </>
  )
}

export default Completed

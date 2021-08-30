import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import * as styles from './History.treat'
import cn from 'classnames'

import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { GetApplicationEventQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import {
  ApplicationEvent,
  ApplicationState,
  getState,
} from '@island.is/financial-aid/shared'

import format from 'date-fns/format'

interface ApplicationEventData {
  applicationEvents: ApplicationEvent[]
}

interface Props {
  className?: string
}

const History = ({ className }: Props) => {
  const router = useRouter()

  const { data } = useQuery<ApplicationEventData>(GetApplicationEventQuery, {
    variables: { input: { id: router.query.id } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  return (
    <Box
      className={cn({
        [`${styles.historyContainer}`]: true,
        [`${className}`]: true,
      })}
    >
      <Text as="h2" variant="h3" color="dark300" marginBottom={3}>
        Saga umsóknar
      </Text>

      {data?.applicationEvents && (
        <>
          {data?.applicationEvents.map((item, index) => {
            return (
              <Box
                key={'timeline-' + index}
                className={cn({
                  [`${styles.timelineContainer}`]: true,
                  [`${styles.firstApplicationEvent}`]:
                    index === data?.applicationEvents.length - 1,
                  [`${styles.acceptedEvent}`]:
                    item.state === ApplicationState.APPROVED,
                  [`${styles.rejectedEvent}`]:
                    item.state === ApplicationState.REJECTED,
                })}
              >
                <Box paddingLeft={3}>
                  <Text variant="h5">{getState[item.state]}</Text>
                  <Text marginBottom={2}>
                    {' '}
                    Umsækjandi <strong>inn umsókn </strong>
                  </Text>

                  {/* <Box paddingLeft={3} marginBottom={2}>
                    {/* TODO: if comment then show */}
                  {/*    <Text variant="small">
                      {comment} f.ex
                      Umsækjandi hringdi og lét mig vita af því að síðustu gögnin sem 
                      vantaði munu berast í síðasta lagi á föstudag þannig að þá getum við 
                      farið að ganga frá þessu.
                    </Text> 
                 
                  </Box> */}

                  {/* TODO: if sent meessage */}
                  {/* <Box
                    paddingLeft={3}
                    marginBottom={2}
                    className={styles.timelineMessages}
                  >
                 
                    <Icon icon="chatbubble" type="outline" />{' '}
                    <Text marginBottom={2}>
                      „Hæhæ hér koma gögnin, afsakið þennan misskilning!
                      Endilega heyrið í mér ef það vantar eitthvað fleira.“` “
                    </Text>
               
                    <Icon icon="checkmark" />{' '}
                    <Text fontWeight="semiBold">
                      Skilaboð send á umsækjanda
                    </Text>
                  </Box> */}

                  <Text variant="small" color="dark300" marginBottom={5}>
                    {format(new Date(item.created), 'dd/MM/yyyy HH:MM')}
                  </Text>
                </Box>
              </Box>
            )
          })}
        </>
      )}
    </Box>
  )
}

export default History

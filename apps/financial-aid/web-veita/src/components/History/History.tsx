import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import * as styles from './History.treat'
import cn from 'classnames'

import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { GetApplicationEventQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import {
  ApplicationEvent,
  ApplicationEventType,
  getEventType,
} from '@island.is/financial-aid/shared/lib'

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
      {data?.applicationEvents && data?.applicationEvents.length > 0 && (
        <>
          <Text as="h2" variant="h3" color="dark300" marginBottom={3}>
            Saga umsóknar
          </Text>

          {data?.applicationEvents.map((item, index) => {
            if (!getEventType[item.eventType]) {
              return null
            }
            return (
              <Box
                key={'timeline-' + index}
                className={cn({
                  [`${styles.timelineContainer}`]: true,
                  [`${styles.acceptedEvent}`]:
                    item.eventType === ApplicationEventType.APPROVED,
                  [`${styles.rejectedEvent}`]:
                    item.eventType === ApplicationEventType.REJECTED,
                })}
              >
                <Box paddingLeft={3}>
                  <Text variant="h5">
                    {getEventType[item.eventType].header}
                  </Text>
                  <Text marginBottom={2}>
                    {' '}
                    XXX <strong>{getEventType[item.eventType].text} </strong>
                  </Text>

                  {item.eventType === ApplicationEventType.STAFFCOMMENT && (
                    <Box paddingLeft={3} marginBottom={2}>
                      <Text variant="small">{item.comment}</Text>
                    </Box>
                  )}

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
          <Box className={styles.fadeOutLineContainer}>
            <svg
              width="2"
              height="100%"
              viewBox="0 0 4 256"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.fadeOutLine}
            >
              <path
                d="M4 256L0 256L2.23802e-05 -3.49691e-07L4.00002 0L4 256Z"
                fill="url(#paint0_linear)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="2"
                  y1="256"
                  x2="2.00002"
                  y2="-1.74846e-07"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </Box>
        </>
      )}
    </Box>
  )
}

export default History

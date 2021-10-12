import React from 'react'
import { Text, Box, Icon } from '@island.is/island-ui/core'

import * as styles from './History.treat'
import cn from 'classnames'

import {
  ApplicationEvent,
  ApplicationEventType,
  getEventType,
} from '@island.is/financial-aid/shared/lib'

import format from 'date-fns/format'

interface Props {
  className?: string
  applicantName?: string
  applicationEvents?: ApplicationEvent[]
}

const History = ({ className, applicantName, applicationEvents }: Props) => {
  return (
    <Box
      className={cn({
        [`${styles.historyContainer}`]: true,
        [`${className}`]: true,
      })}
    >
      {applicationEvents && applicationEvents.length > 0 && (
        <>
          <Text as="h2" variant="h3" color="dark300" marginBottom={3}>
            Saga umsóknar
          </Text>

          {applicationEvents.map((item, index) => {
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
                    {getEventType[item.eventType].isStaff
                      ? 'Starfsmaður'
                      : `Umsækjandi ${applicantName}`}{' '}
                    <strong>{getEventType[item.eventType].text} </strong>
                  </Text>

                  {item.eventType === ApplicationEventType.STAFFCOMMENT && (
                    <Box paddingLeft={3} marginBottom={2}>
                      <Text variant="small">{item.comment}</Text>
                    </Box>
                  )}

                  {item.eventType === ApplicationEventType.FILEUPLOAD && (
                    <Box
                      paddingLeft={3}
                      marginBottom={2}
                      className={styles.timelineMessages}
                    >
                      {item.comment && (
                        <>
                          <Icon icon="chatbubble" type="outline" />{' '}
                          <Text marginBottom={2}>„{item.comment}“</Text>
                        </>
                      )}
                    </Box>
                  )}

                  {item.eventType === ApplicationEventType.DATANEEDED &&
                    item.comment && (
                      <Box
                        paddingLeft={3}
                        marginBottom={2}
                        className={styles.timelineMessages}
                      >
                        <Icon icon="chatbubble" type="outline" />{' '}
                        <Text marginBottom={2}>„{item.comment}“</Text>
                      </Box>
                    )}

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

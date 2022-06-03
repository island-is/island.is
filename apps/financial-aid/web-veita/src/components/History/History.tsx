import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import * as styles from './History.css'
import cn from 'classnames'

import { ApplicationEvent } from '@island.is/financial-aid/shared/lib'

import {
  ChatElement,
  EmailElement,
  TimeLineContainer,
} from '@island.is/financial-aid-web/veita/src/components'

interface Props {
  className?: string
  applicantName: string
  applicantEmail: string
  applicationEvents?: ApplicationEvent[]
  spouseName: string
}

const History = ({
  className,
  applicantName,
  applicantEmail,
  spouseName,
  applicationEvents,
}: Props) => {
  if (!applicationEvents || applicationEvents.length <= 0) {
    return <></>
  }

  return (
    <>
      <Box
        className={styles.historyHeadline}
        marginBottom={[2, 2, 3]}
        borderBottomWidth="standard"
        borderColor="dark200"
      >
        <Text as="h2" variant="h3" color="dark300" marginBottom={1}>
          Saga umsóknar
        </Text>
      </Box>
      <Box
        className={cn({
          [`${styles.historyContainer} printableSection`]: true,
          [`${className}`]: true,
        })}
      >
        {applicationEvents.map((item, index) => {
          return (
            <TimeLineContainer
              event={item}
              key={'timeline-' + index}
              applicantName={applicantName}
              spouseName={spouseName}
            >
              <Box paddingLeft={3}>
                <ChatElement comment={item.comment} />
                <EmailElement email={applicantEmail} event={item.eventType} />
              </Box>
            </TimeLineContainer>
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
      </Box>
    </>
  )
}

export default History

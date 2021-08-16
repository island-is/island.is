import React from 'react'
import { Text, Box, FormStepper } from '@island.is/island-ui/core'

import * as styles from './History.treat'
import cn from 'classnames'

import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { GetApplicationEventQuery } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import { ApplicationEvent, getState } from '@island.is/financial-aid/shared'

interface ApplicationEventData {
  applicationEvents: ApplicationEvent[]
}

interface Props {
  className?: string
}

const History = ({ className }: Props) => {
  const router = useRouter()

  const { data, error, loading } = useQuery<ApplicationEventData>(
    GetApplicationEventQuery,
    {
      variables: { input: { id: router.query.id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  return (
    <Box
      className={cn({
        [`${styles.takeFullSpace}`]: true,
        [`${className}`]: true,
      })}
      marginBottom={[2, 2, 3]}
    >
      <Text as="h2" variant="h3" color="dark300">
        Tímalína
      </Text>

      {data?.applicationEvents && (
        <FormStepper
          activeSection={data?.applicationEvents.length - 1}
          sections={data?.applicationEvents.map((event) => {
            if (event.comment) {
              return {
                name: getState[event.state],
                children: [
                  {
                    type: 'SUB_SECTION',
                    name: event.comment,
                  },
                ],
              }
            }
            return { name: getState[event.state] }
          })}
        />
      )}
    </Box>
  )
}

export default History

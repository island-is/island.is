import React from 'react'

import { RegulationDraft } from '@island.is/regulations/admin'
import { ISODate, RegName } from '@island.is/regulations'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { Box, Stack, Text, TopicCard } from '@island.is/island-ui/core'
// import { mockShippedList, useMockQuery } from '../_mockData'
import { homeMessages as msg } from '../messages'
import { prettyName } from '@island.is/regulations'
import { useLocale } from '../utils'

const ShippedRegulationsQuery = gql`
  query ShippedRegulationsQuery {
    getShippedRegulations {
      id
      name
      title
      idealPublishDate
    }
  }
`

// const ShippedRegulationsQuery = gql`
//   query ShippedRegulationsQuery {
//     getShippedRegulations
//   }
// `

export const ShippedRegulations = () => {
  const { formatMessage, formatDateFns } = useLocale()
  // const { data, loading } = useMockQuery({
  //   shippedRegulations: mockShippedList,
  // })
  const { data, loading } = useQuery<Query>(ShippedRegulationsQuery)

  const { getShippedRegulations = [] } = data || {}

  if (getShippedRegulations.length === 0) {
    return null
  }

  if (loading) {
    return null
  }

  return (
    <Box marginTop={[4, 4, 6]}>
      <Text variant="h2" as="h2" marginBottom={2}>
        {formatMessage(msg.shippedTitle)}
      </Text>
      <Stack space={1}>
        {getShippedRegulations.map((shipped: RegulationDraft) => (
          <TopicCard
            key={shipped.id}
            tag={formatDateFns(shipped.idealPublishDate as ISODate)}
            onClick={() => undefined}
          >
            {prettyName(shipped.name as RegName)} {shipped.title}
          </TopicCard>
        ))}
      </Stack>
    </Box>
  )
}

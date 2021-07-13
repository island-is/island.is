import React from 'react'

// import { gql, useQuery } from '@apollo/client'
// import { Query } from '@island.is/api/schema'
import {
  ActionCard,
  Box,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { mockMinistrylist, useMockQuery } from '../_mockData'
import { ministryMessages as msg } from '../messages'
import { ISODate } from '@island.is/regulations'
import { workingDaysUntil, useLocale } from '../utils'
import { generatePath, useHistory } from 'react-router'
import { ServicePortalPath } from '@island.is/service-portal/core'

// const RegulationMinistryListQuery = gql`
//   query RegulationMinistryListQuery {
//     ministryList {
//       id
//       title
//     }
//   }
// `

export const MinistryList = () => {
  const { formatMessage, formatDateFns } = useLocale()
  const history = useHistory()
  const { data, loading } = useMockQuery({
    regulationMinistries: mockMinistrylist,
  }) // useQuery<Query>(RegulationMinistryListQuery)

  if (loading) {
    return (
      <Box marginBottom={[4, 4, 6]}>
        <SkeletonLoader height={80} repeat={3} space={1} />
      </Box>
    )
  }

  const { regulationMinistries = [] } = data || {}

  if (regulationMinistries.length === 0) {
    return null
  }

  return (
    <Box marginBottom={[4, 4, 6]}>
      <Stack space={2}>
        {regulationMinistries.map((item, i) => {
          const { name, slug, current } = item
          return (
            <ActionCard
              key={slug + '-' + i}
              heading={name}
              tag={{
                label: current ? 'Active' : 'Inactive',
                outlined: true,
                variant: current ? 'blueberry' : 'red',
              }}
              // text={''}
              cta={{
                label: formatMessage(msg.cta),
                // variant: draftingStatus === 'draft' ? 'ghost' : undefined,
                // onClick: () => {},
              }}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

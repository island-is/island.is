import React from 'react'
import { RegulationDraft, DraftingStatus } from '@island.is/regulations/admin'

import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  ActionCard,
  Box,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
// import { mockDraftlist, useMockQuery } from '../_mockData'
import { homeMessages as msg, statusMsgs } from '../messages'
import { ISODate, toISODate } from '@island.is/regulations'
import { workingDaysUntil, useLocale } from '../utils'
import { generatePath, useHistory } from 'react-router'
import { ServicePortalPath } from '@island.is/service-portal/core'

const RegulationTaskListQuery = gql`
  query RegulationTaskListQuery {
    getDraftRegulations
  }
`

export const TaskList = () => {
  const { formatMessage, formatDateFns } = useLocale()
  const history = useHistory()
  // const { data, loading } = useMockQuery({ regulationDraft: mockDraftlist }) // useQuery<Query>(RegulationTaskListQuery)
  const { data, loading } = useQuery<Query>(RegulationTaskListQuery, {
    fetchPolicy: 'no-cache',
  })

  if (loading) {
    return (
      <Box marginBottom={[4, 4, 6]}>
        <SkeletonLoader height={80} repeat={3} space={1} />
      </Box>
    )
  }

  const { getDraftRegulations = [] } = data || {}

  if (getDraftRegulations.length === 0) {
    return null
  }

  const getReqDate = (
    date: ISODate | undefined,
    fastTrack?: boolean,
  ): string => {
    if (!date) {
      return formatMessage(msg.publishSoon)
    }
    const target = workingDaysUntil(date)

    const fastTrackMsg = fastTrack
      ? ' ' + formatMessage(msg.publishFastTrack)
      : ''
    const formattedDate = formatDateFns(date, 'd. MMM')

    if (target.today) {
      const today = toISODate(new Date())
      const overdueMsg = date < today ? `  (${formattedDate})` : ''
      return formatMessage(msg.publishToday) + overdueMsg + fastTrackMsg
    }
    return formattedDate + fastTrackMsg
  }

  return (
    <Box marginBottom={[4, 4, 6]}>
      <Text variant="h2" as="h2" marginBottom={2}>
        {formatMessage(msg.taskListTitle)}
      </Text>
      <Stack space={2}>
        {getDraftRegulations.map((item: RegulationDraft) => {
          const { id, title, idealPublishDate, draftingStatus, authors } = item
          // const statusLabel = formatMessage(statusMsgs[draftingStatus])

          return (
            <ActionCard
              key={id}
              date={getReqDate(idealPublishDate as ISODate, item.fastTrack)}
              backgroundColor={item.fastTrack ? 'blue' : undefined}
              heading={title ?? ''}
              tag={{
                label: formatMessage(
                  statusMsgs[draftingStatus as DraftingStatus],
                ),
                outlined: true,
                variant: draftingStatus === 'proposal' ? 'blueberry' : 'red',
              }}
              // text={authors?.map(({ name }) => name).join(', ')}
              text={authors
                ?.map((item) => item.name || item.authorId)
                .join(', ')}
              cta={{
                // icon: 'arrowForward',
                label: formatMessage(msg.cta),
                // variant: draftingStatus === 'draft' ? 'ghost' : undefined,
                onClick: () => {
                  history.push(
                    generatePath(ServicePortalPath.RegulationsAdminEdit, {
                      id,
                    }),
                  )
                },
              }}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

import React from 'react'
import {
  ActionCard,
  Box,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { homeMessages as msg, statusMsgs } from '../messages'
import { ISODate, toISODate } from '@island.is/regulations'
import { workingDaysUntil, useLocale } from '../utils'
import { useHistory } from 'react-router'
import { getEditUrl } from '../utils/routing'
import { useRegulationTaskListQuery } from '../utils/dataHooks'

export const TaskList = () => {
  const { formatMessage, formatDateFns } = useLocale()
  const t = formatMessage

  const history = useHistory()
  const tasklist = useRegulationTaskListQuery()

  if (tasklist.loading || tasklist.error) {
    return (
      <Box marginBottom={[4, 4, 8]}>
        <SkeletonLoader height={80} repeat={3} space={3} />
      </Box>
    )
  }

  if (tasklist.data.length === 0) {
    return null
  }

  const getReqDate = (
    date: ISODate | undefined,
    fastTrack?: boolean,
  ): string => {
    if (!date) {
      return t(msg.publishSoon)
    }
    const target = workingDaysUntil(date)

    const fastTrackMsg = fastTrack ? ' ' + t(msg.publishFastTrack) : ''
    const formattedDate = formatDateFns(date, 'd. MMM')

    if (target.today) {
      const today = toISODate(new Date())
      const overdueMsg = date < today ? `  (${formattedDate})` : ''
      return t(msg.publishToday) + overdueMsg + fastTrackMsg
    }
    return formattedDate + fastTrackMsg
  }

  return (
    <Box marginBottom={[4, 4, 8]}>
      <Text variant="h3" as="h2" paddingY={[1, 1]} marginBottom={[2, 2, 3]}>
        {t(msg.taskListTitle)}
      </Text>
      <Stack space={3}>
        {tasklist.data.map((item) => {
          const {
            id,
            title,
            idealPublishDate,
            fastTrack,
            draftingStatus,
            authors,
          } = item
          // const statusLabel = formatMessage(statusMsgs[draftingStatus])

          return (
            <ActionCard
              key={id}
              date={getReqDate(idealPublishDate, fastTrack)}
              backgroundColor={fastTrack ? 'blue' : undefined}
              heading={title ?? ''}
              tag={{
                label: t(statusMsgs[draftingStatus]),
                outlined: false,
                variant: draftingStatus === 'proposal' ? 'blueberry' : 'red',
              }}
              text={authors
                ?.map((item) => item.name || item.authorId)
                .join(', ')}
              cta={{
                icon: 'arrowForward',
                label: t(msg.cta),
                variant: 'ghost',
                onClick: () => {
                  history.push(getEditUrl(id))
                },
              }}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

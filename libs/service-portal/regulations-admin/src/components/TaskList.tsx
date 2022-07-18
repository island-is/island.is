import React, { useCallback, useState } from 'react'
import {
  ActionCard,
  Box,
  SkeletonLoader,
  Stack,
  Pagination,
} from '@island.is/island-ui/core'
import { homeMessages as msg, statusMsgs } from '../messages'
import { ISODate, toISODate } from '@island.is/regulations'
import { workingDaysUntil } from '../utils'
import { useHistory } from 'react-router-dom'
import { getEditUrl } from '../utils/routing'
import { useRegulationTaskListQuery } from '../utils/dataHooks'
import { useLocale } from '@island.is/localization'

export const TaskList = () => {
  const { formatMessage, formatDateFns } = useLocale()
  const t = formatMessage
  const [page, setPage] = useState(1)
  const history = useHistory()
  const handlePageChange = useCallback((page: number) => setPage(page), [])
  const { loading, data, error } = useRegulationTaskListQuery(page)

  const drafts = data?.drafts
  const paging = data?.paging

  if (loading || error) {
    return (
      <Box marginBottom={[4, 4, 8]}>
        <SkeletonLoader height={80} repeat={3} space={3} />
      </Box>
    )
  }

  if (drafts && drafts.length === 0) {
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
    <Box marginBottom={[4, 4, 8]} marginTop={6}>
      <Stack space={3}>
        {drafts &&
          drafts.map((item) => {
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
                heading={title || t(msg.taskList_draftTitleMissing)}
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
                  label: t(msg.cta_seeRegulation),
                  variant: 'text',
                  size: 'small',
                  onClick: () => {
                    history.push(getEditUrl(id))
                  },
                }}
              />
            )
          })}
        {paging && paging.pages > 1 && (
          <Pagination
            page={page}
            totalPages={paging.pages}
            renderLink={(page, className, children) => (
              <button
                className={className}
                onClick={handlePageChange.bind(null, page)}
              >
                {children}
              </button>
            )}
          />
        )}
      </Stack>
    </Box>
  )
}

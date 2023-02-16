import * as kennitala from 'kennitala'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { SessionsSession } from '@island.is/api/schema'
import {
  Box,
  LoadingDots,
  Text,
  SkeletonLoader,
  ToastContainer,
  toast,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import LogTable from '../../components/LogTable/LogTable'
import LogTableMobile from '../../components/LogTable/LogTableMobile'
import { m } from '../../lib/messages'
import { useGetSessionsListQuery } from './Sessions.generated'
import SessionFilter from '../../components/SessionFilter/SessionFilter'
import addYears from 'date-fns/addYears'

const SESSION_LIMIT = 20
const initialDates = {
  fromDate: addYears(new Date(), -1),
  toDate: new Date(),
}

const Sessions = () => {
  const { formatMessage } = useLocale()
  const { lg } = useBreakpoint()

  const [sessionsData, setSessionsData] = useState<SessionsSession[]>([])
  const [searchNationalId, setSearchNationalId] = useState('')
  const [nextCursor, setNextCursor] = useState<string>('')
  const [customLoading, setCustomLoading] = React.useState(true)
  const [fromDate, setFromDate] = useState<Date>(initialDates.fromDate)
  const [toDate, setToDate] = useState<Date>(initialDates.toDate)
  const getQueryVariables = (
    next: string,
    nationalId: string,
    dateFrom: Date | null,
    dateTo: Date | null,
  ) => {
    return {
      input: {
        limit: SESSION_LIMIT,
        before: '',
        after: next,
        nationalId: kennitala.isValid(nationalId) ? nationalId : '',
        toDate: dateTo ? dateTo.toDateString() : '',
        fromDate: dateFrom ? dateFrom.toDateString() : '',
      },
    }
  }

  const { data, error, refetch } = useGetSessionsListQuery({
    variables: getQueryVariables(
      '',
      '',
      initialDates.fromDate,
      initialDates.toDate,
    ),
    onCompleted: (data) => {
      setSessionsData([
        ...(sessionsData as SessionsSession[]),
        ...(data.sessionsList.data as SessionsSession[]),
      ])
      setNextCursor(data.sessionsList.pageInfo.endCursor ?? '')
      setCustomLoading(false)
    },
    onError: () => {
      toast.error(formatMessage(m.error))
    },
  })

  const loadMore = () => {
    if (customLoading || !data) return

    if (data?.sessionsList.pageInfo.hasNextPage) {
      setCustomLoading(true)
      refetch({
        ...getQueryVariables(nextCursor, searchNationalId, fromDate, toDate),
      }).then((res) => {
        setSessionsData([
          ...(sessionsData as SessionsSession[]),
          ...(res.data?.sessionsList.data as SessionsSession[]),
        ])
        setNextCursor(res.data?.sessionsList.pageInfo.endCursor ?? '')
        setCustomLoading(false)
      })
    }
  }

  const handleDateChange = (date: Date, type: 'from' | 'to' | 'clear') => {
    setSessionsData([])
    setCustomLoading(true)
    refetch({
      ...getQueryVariables(
        '',
        searchNationalId,
        type === 'clear'
          ? initialDates.fromDate
          : type === 'from'
          ? date
          : fromDate,
        type === 'clear' ? initialDates.toDate : type === 'to' ? date : toDate,
      ),
    }).then((res) => {
      setSessionsData(res.data?.sessionsList.data as SessionsSession[])
      setNextCursor(res.data?.sessionsList.pageInfo.endCursor ?? '')
      setCustomLoading(false)
    })
    if (type === 'clear') {
      setFromDate(initialDates.fromDate)
      setToDate(initialDates.toDate)
    }
    if (type === 'from') {
      setFromDate(date)
    } else {
      setToDate(date)
    }
  }

  const handleChange = (value: string): void => {
    setSearchNationalId(value)
    if (kennitala.isValid(value)) {
      setSessionsData([])
      setCustomLoading(true)
      refetch({
        ...getQueryVariables('', value, fromDate, toDate),
      }).then((res) => {
        setSessionsData(res.data?.sessionsList.data as SessionsSession[])
        setNextCursor(res.data?.sessionsList.pageInfo.endCursor ?? '')
        setCustomLoading(false)
      })
    } else if (
      !kennitala.isValid(value) &&
      kennitala.isValid(searchNationalId)
    ) {
      setSessionsData([])
      setCustomLoading(true)
      refetch({
        ...getQueryVariables('', '', fromDate, toDate),
      }).then((res) => {
        setSessionsData(res.data?.sessionsList.data as SessionsSession[])
        setNextCursor(res.data?.sessionsList.pageInfo.endCursor ?? '')
        setCustomLoading(false)
      })
    }
  }

  return (
    <>
      <IntroHeader
        title={formatMessage(m.sessions)}
        intro={formatMessage(m.sessionsHeaderIntro)}
      />
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        paddingBottom={[3, 3, 4, 4]}
      >
        <SessionFilter
          fromDate={fromDate}
          toDate={toDate}
          handleDateChange={handleDateChange}
          onFilterChange={handleChange}
          nationalId={searchNationalId}
          resultCount={
            data?.sessionsList.totalCount ? data?.sessionsList.totalCount : 0
          }
        />
      </Box>
      {data ? (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={data?.sessionsList.pageInfo.hasNextPage}
          loader={
            <Box
              key={'sessions.screens.sessions.loader'}
              marginTop={'gutter'}
              display={'flex'}
              justifyContent={'center'}
            >
              {customLoading && <LoadingDots large />}
            </Box>
          }
        >
          {lg ? (
            <LogTable data={sessionsData} />
          ) : (
            <LogTableMobile sessions={sessionsData} />
          )}
        </InfiniteScroll>
      ) : error ? (
        <Box display={'flex'} justifyContent={'center'}>
          <Text>{formatMessage(m.error)}</Text>
        </Box>
      ) : (
        <SkeletonLoader height={40} repeat={6} width={'100%'} />
      )}
      <ToastContainer />
    </>
  )
}

export default Sessions

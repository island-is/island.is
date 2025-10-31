import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import * as kennitala from 'kennitala'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { SessionsSession } from '@island.is/api/schema'
import {
  Box,
  LoadingDots,
  SkeletonLoader,
  ToastContainer,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
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
  useNamespaces('portals-my-pages.session-history')
  const user = useUserInfo()
  const isCompany = user.profile.subjectType === 'legalEntity'
  const { formatMessage } = useLocale()
  const { lg } = useBreakpoint()

  const [sessionsData, setSessionsData] = useState<SessionsSession[]>([])
  const [searchNationalId, setSearchNationalId] = useState('')
  const [nextCursor, setNextCursor] = useState<string>('')
  const [customLoading, setCustomLoading] = React.useState(true)
  const [filterDates, setFilterDates] = useState<{
    fromDate: Date
    toDate: Date
  }>(initialDates)
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
  })

  const loadMore = () => {
    if (customLoading || !data) return

    if (data?.sessionsList.pageInfo.hasNextPage) {
      setCustomLoading(true)
      refetch({
        ...getQueryVariables(
          nextCursor,
          kennitala.format(searchNationalId, false),
          filterDates.fromDate,
          filterDates.toDate,
        ),
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
        kennitala.format(searchNationalId, false),
        type === 'clear'
          ? initialDates.fromDate
          : type === 'from'
          ? date
          : filterDates.fromDate,
        type === 'clear'
          ? initialDates.toDate
          : type === 'to'
          ? date
          : filterDates.toDate,
      ),
    }).then((res) => {
      setSessionsData(res.data?.sessionsList.data as SessionsSession[])
      setNextCursor(res.data?.sessionsList.pageInfo.endCursor ?? '')
      setCustomLoading(false)
    })
    if (type === 'clear') {
      setFilterDates(initialDates)
    } else if (type === 'from') {
      setFilterDates((prev) => ({ ...prev, fromDate: date }))
    } else if (type === 'to') {
      setFilterDates((prev) => ({ ...prev, toDate: date }))
    }
  }

  const handleNationalIdChange = (value: string): void => {
    setSearchNationalId(value)
    if (kennitala.isValid(value)) {
      setSessionsData([])
      setCustomLoading(true)
      refetch({
        ...getQueryVariables(
          '',
          kennitala.format(value, false),
          filterDates.fromDate,
          filterDates.toDate,
        ),
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
        ...getQueryVariables('', '', filterDates.fromDate, filterDates.toDate),
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
        intro={formatMessage(
          isCompany ? m.sessionsHeaderIntroCompany : m.sessionsHeaderIntro,
        )}
      />
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        paddingBottom={[3, 3, 4, 4]}
      >
        <SessionFilter
          fromDate={filterDates.fromDate}
          toDate={filterDates.toDate}
          handleDateChange={handleDateChange}
          onNationalIdFilterChange={handleNationalIdChange}
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
              {customLoading && <LoadingDots size="large" />}
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
        <Problem error={error} />
      ) : (
        <SkeletonLoader height={40} repeat={6} width={'100%'} />
      )}
      <ToastContainer />
    </>
  )
}

export default Sessions

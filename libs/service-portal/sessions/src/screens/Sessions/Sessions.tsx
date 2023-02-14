import * as kennitala from 'kennitala'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { SessionsSession } from '@island.is/api/schema'
import {
  Box,
  GridColumn,
  Hidden,
  LoadingDots,
  Text,
  SkeletonLoader,
  ToastContainer,
  toast,
  Input,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import LogTable from '../../components/LogTable/LogTable'
import LogTableMobile from '../../components/LogTable/LogTableMobile'
import useOnScreen from '../../utils/useOnScreen'
import { m } from '../../lib/messages'
import { useGetSessionsListQuery } from './Sessions.generated'

const SESSION_LIMIT = 20

const Sessions = () => {
  const { formatMessage } = useLocale()

  const [sessionsData, setSessionsData] = useState<SessionsSession[]>([])
  const [searchNationalId, setSearchNationalId] = useState('')
  const [nextCursor, setNextCursor] = useState<string>('')
  const [customLoading, setCustomLoading] = React.useState(true)

  const getQueryVariables = (next: string, nationalId: string) => {
    return {
      input: {
        limit: SESSION_LIMIT,
        before: '',
        after: next,
        nationalId: kennitala.isValid(nationalId) ? nationalId : '',
        toDate: '',
        fromDate: '',
      },
    }
  }

  const { data, error, refetch } = useGetSessionsListQuery({
    variables: getQueryVariables('', ''),
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
      refetch({ ...getQueryVariables(nextCursor, searchNationalId) }).then(
        (res) => {
          setSessionsData([
            ...(sessionsData as SessionsSession[]),
            ...(res.data?.sessionsList.data as SessionsSession[]),
          ])
          setNextCursor(res.data?.sessionsList.pageInfo.endCursor ?? '')
          setCustomLoading(false)
        },
      )
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setSearchNationalId(e.target.value)
    if (kennitala.isValid(e.target.value)) {
      setSessionsData([])
      setCustomLoading(true)
      refetch({
        ...getQueryVariables('', e.target.value),
      }).then((res) => {
        setSessionsData(res.data?.sessionsList.data as SessionsSession[])
        setNextCursor(res.data?.sessionsList.pageInfo.endCursor ?? '')
        setCustomLoading(false)
      })
    } else if (
      !kennitala.isValid(e.target.value) &&
      kennitala.isValid(searchNationalId)
    ) {
      setSessionsData([])
      setCustomLoading(true)
      refetch({
        ...getQueryVariables('', ''),
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
        <GridColumn span={['12/12', '12/12', '12/12', '6/12', '4/12']}>
          <Input
            backgroundColor={'blue'}
            maxLength={10}
            type={'text'}
            placeholder={formatMessage(m.search)}
            name="filterInput"
            value={searchNationalId}
            size="sm"
            icon={'search'}
            iconType={'outline'}
            onChange={handleChange}
          />
        </GridColumn>
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
          <Hidden below={'lg'}>
            <LogTable data={sessionsData} />
          </Hidden>
          <Hidden above={'md'}>
            <LogTableMobile sessions={sessionsData} />
          </Hidden>
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

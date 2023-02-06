import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  Button,
  FilterInput,
  Hidden,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import React, { Fragment, useState } from 'react'
import HistoryTable from '../../components/HistoryTable/HistoryTable'
import HistoryTableMobile from '../../components/HistoryTable/HistoryTableMobile'

import { m } from '../../lib/messages'
import PersonIcon from '../../components/PersonIcon/PersonIcon'
import {
  GetSessionsListQuery,
  useGetSessionsListQuery,
} from './Sessions.generated'
import {
  Exact,
  SessionsInput,
  SessionsPaginatedSessionResponse,
  SessionsSession,
} from '@island.is/api/schema'
import { SessionType } from '../../lib/types/sessionTypes'
import { useSearchParams } from 'react-router-dom'
import { QueryHookOptions } from '@apollo/client'
import { SessionsPaths } from '../../lib/paths'

const enum PaginationNavigation {
  NEXT = 'next',
  PREV = 'prev',
}

const Sessions = () => {
  const SESSION_LIMIT = 2
  const QUERY_PARAM_NAME = 'pageNo'
  const [searchParams] = useSearchParams()
  const { formatMessage } = useLocale()
  const [searchNationalId, setSearchNationalId] = useState('')
  const [page, setPage] = useState<number>(1)

  const getOptions = (): QueryHookOptions<
    GetSessionsListQuery,
    Exact<{ input: SessionsInput }>
  > => {
    return {
      fetchPolicy: 'network-only',
      variables: {
        input: {
          limit: SESSION_LIMIT,
          before: '',
          after: page.toString(),
          nationalId: '',
          toDate: '',
          fromDate: '',
        },
      },
    }
  }

  const { data, loading, error, refetch } = useGetSessionsListQuery({
    ...getOptions(),
  })

  React.useEffect(() => {
    refetch({
      ...getOptions().variables,
    })
  }, [page])

  const handleChange = (value: string): void => {
    setSearchNationalId(value)
  }

  const handlePageChange = (action: PaginationNavigation): void => {
    if (
      !data ||
      (page === 1 && action === 'prev') ||
      (page * SESSION_LIMIT >= data?.sessionsList?.totalCount &&
        action === 'next')
    )
      return
    let temp: number = page
    action === 'next' ? (temp = temp + 1) : (temp = temp - 1)
    setPage(temp)
    const path = `${SessionsPaths.LoginHistory}?${QUERY_PARAM_NAME}=${temp}`

    window.history.pushState({ path: path }, '', path)
  }

  return (
    <>
      <Box paddingBottom={'containerGutter'}>
        <Breadcrumbs
          items={
            [
              {
                title: formatMessage(m.delegations),
                href: SessionsPaths.Delegate,
              },
              {
                title: formatMessage(m.sessions),
                href: SessionsPaths.LoginHistory,
              },
            ] as BreadCrumbItem[]
          }
        />
      </Box>
      <IntroHeader
        title={formatMessage(m.sessions)}
        intro={formatMessage(m.sessionsHeaderIntro)}
      />
      <Hidden above={'md'}>
        <Box columnGap="gutter" display="flex" paddingBottom={4}>
          <Box columnGap="smallGutter" display="flex" alignItems="center">
            <PersonIcon sessionType={SessionType.onBehalf} />
            <Text>{formatMessage(m.onBehalfOF)}</Text>
          </Box>
          <Box columnGap="smallGutter" display="flex" alignItems="center">
            <PersonIcon sessionType={SessionType.myBehalf} />
            <Text>{formatMessage(m.inYourBehalf)}</Text>
          </Box>
        </Box>
      </Hidden>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        paddingBottom={[3, 3, 4, 4]}
      >
        <FilterInput
          placeholder={formatMessage(m.search)}
          name="filterInput"
          value={searchNationalId}
          onChange={handleChange}
        />
        <Box columnGap="gutter" display="flex" alignItems="center">
          <Button
            circle
            size="small"
            colorScheme="light"
            icon={'arrowBack'}
            onClick={() => handlePageChange(PaginationNavigation.PREV)}
          />
          <Button
            circle
            size="small"
            colorScheme="light"
            icon={'arrowForward'}
            onClick={() => handlePageChange(PaginationNavigation.NEXT)}
          />
        </Box>
      </Box>
      {data && !loading ? (
        <Fragment>
          <Hidden below={'lg'}>
            <HistoryTable data={data.sessionsList.data as SessionsSession[]} />
          </Hidden>
          <Hidden above={'md'}>
            <HistoryTableMobile
              sessions={data.sessionsList.data as SessionsSession[]}
            />
          </Hidden>
        </Fragment>
      ) : loading ? (
        <Box width="full" display="flex" justifyContent="center">
          <LoadingDots />
        </Box>
      ) : (
        <Text>Engar niðurstöður</Text>
      )}
    </>
  )
}

export default Sessions

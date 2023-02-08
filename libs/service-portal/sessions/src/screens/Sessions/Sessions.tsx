import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  Button,
  GridColumn,
  FilterInput,
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
import React, { Fragment, useRef, useState } from 'react'
import LogTable from '../../components/LogTable/LogTable'
import LogTableMobile from '../../components/LogTable/LogTableMobile'

import { m } from '../../lib/messages'
import PersonIcon from '../../components/PersonIcon/PersonIcon'
import {
  GetSessionsListQuery,
  useGetSessionsListQuery,
} from './Sessions.generated'
import { Exact, SessionsInput, SessionsSession } from '@island.is/api/schema'
import { SessionType } from '../../lib/types/sessionTypes'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { QueryHookOptions } from '@apollo/client'
import { SessionsPaths } from '../../lib/paths'
import * as kennitala from 'kennitala'

const enum PaginationNavigation {
  NEXT = 'next',
  PREV = 'prev',
}

interface CursorState {
  before: string
  after: string
}

const Sessions = () => {
  const SESSION_LIMIT = 10
  const QUERY_PARAM_NAME = 'cursor'
  const { formatMessage } = useLocale()
  const [searchNationalId, setSearchNationalId] = useState('')
  const [prevSearchNationalId, setPrevSearchNationalId] = useState('')
  const [sentNationalId, setSentNationalId] = useState('')
  const [page, setPage] = useState<CursorState>({ before: '', after: '' })

  const getOptions = (): QueryHookOptions<
    GetSessionsListQuery,
    Exact<{ input: SessionsInput }>
  > => {
    return {}
  }

  const { data, loading, error } = useGetSessionsListQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        limit: SESSION_LIMIT,
        before: page.before,
        after: page.after,
        nationalId: sentNationalId ?? '',
        toDate: '',
        fromDate: '',
      },
    },
    onError: () => {
      toast.error(formatMessage(m.error))
    },
  })

  React.useEffect(() => {
    if (kennitala.isValid(searchNationalId)) {
      setSentNationalId(searchNationalId)
    } else if (
      kennitala.isValid(prevSearchNationalId) &&
      !kennitala.isValid(searchNationalId)
    ) {
      setSentNationalId('')
    }
  }, [searchNationalId])

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setPrevSearchNationalId(searchNationalId)
    setSearchNationalId(e.target.value)
  }

  const handlePageChange = (action: PaginationNavigation): void => {
    // If there is no data or if there is no previous page and we are trying to go back or if there is no next page and we are trying to go forward, return
    if (
      !data ||
      (!data.sessionsList.pageInfo.hasPreviousPage && action === 'prev') ||
      (!data.sessionsList.pageInfo.hasNextPage && action === 'next')
    )
      return
    let temp = ''
    // If we are going forward, set the cursor to the end of the current page, otherwise set it to the start of the current page
    if (action === 'next') {
      temp = data.sessionsList.pageInfo.endCursor ?? ''
      setPage({
        after: data?.sessionsList.pageInfo.endCursor ?? '',
        before: '',
      })
    }
    // If we are going back, set the cursor to the start of the current page, otherwise set it to the end of the current page
    if (action === 'prev') {
      temp = data.sessionsList.pageInfo.startCursor ?? ''
      setPage({
        after: '',
        before: data?.sessionsList.pageInfo.startCursor ?? '',
      })
    }

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
        {/*<Hidden below={'lg'}>*/}
        <Box
          marginLeft={'gutter'}
          columnGap="gutter"
          display="flex"
          alignItems="center"
        >
          <Button
            disabled={!data?.sessionsList.pageInfo.hasPreviousPage || loading}
            circle
            size="default"
            colorScheme="light"
            icon={'arrowBack'}
            onClick={() => handlePageChange(PaginationNavigation.PREV)}
          />
          <Button
            disabled={!data?.sessionsList.pageInfo.hasNextPage || loading}
            circle
            size="default"
            colorScheme="light"
            icon={'arrowForward'}
            onClick={() => handlePageChange(PaginationNavigation.NEXT)}
          />
        </Box>
        {/*</Hidden>*/}
      </Box>
      {data ? (
        <Fragment>
          <Hidden below={'lg'}>
            <LogTable
              loading={loading}
              data={data.sessionsList.data as SessionsSession[]}
            />
          </Hidden>
          <Hidden above={'md'}>
            <LogTableMobile
              loading={loading}
              sessions={data.sessionsList.data as SessionsSession[]}
            />
          </Hidden>
        </Fragment>
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

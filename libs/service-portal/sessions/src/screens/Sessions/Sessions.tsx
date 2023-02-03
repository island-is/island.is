import {
  Box,
  Breadcrumbs,
  Filter,
  FilterInput,
  FilterMultiChoice,
  Hidden,
  LoadingDots,
  Pagination,
  BreadCrumbItem,
  Text,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import React, { Fragment, useEffect, useState } from 'react'
import HistoryTable from '../../components/HistoryTable/HistoryTable'
import HistoryTableMobile from '../../components/HistoryTable/HistoryTableMobile'

import { m } from '../../lib/messages'
import { helperStyles, theme } from '@island.is/island-ui/theme'
import PersonIcon from '../../components/PersonIcon/PersonIcon'
import { useGetSessionsListQuery } from './Sessions.generated'
import {
  SessionsPaginatedSessionResponse,
  SessionsSession,
} from '@island.is/api/schema'
import { SessionType } from '../../lib/types/sessionTypes'
import Link from 'next/link'

const Sessions = () => {
  const SESSION_LIMIT = 2
  const { formatMessage } = useLocale()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState<number>(0)

  const { data, loading } = useGetSessionsListQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        limit: SESSION_LIMIT,
        before: '',
        after: '',
        nationalId: '',
        toDate: '',
        fromDate: '',
      },
    },
    onCompleted(data) {
      const session = data?.sessionsList
        ? (data.sessionsList as SessionsPaginatedSessionResponse)
        : undefined
      console.log(session)
    },
    onError(error) {
      console.log(error)
    },
  })

  const handleChange = (value: any) => {
    setSearch(value)
  }

  const handlePageChange = (action: 'next' | 'prev') => {
    if (!data) return
    if (page === 0 && action === 'prev') return
    if (
      page * SESSION_LIMIT + SESSION_LIMIT >= data?.sessionsList?.totalCount &&
      action === 'next'
    )
      return

    if (action === 'next') {
      setPage(page + 1)
    } else {
      setPage(page - 1)
    }
  }
  return (
    <>
      <Box paddingBottom={'containerGutter'}>
        <Breadcrumbs
          items={
            [
              {
                title: formatMessage(m.delegations),
                href: '/minarsidur',
              },
              {
                title: formatMessage(m.sessions),
                href: '/minarsidur/innskraningar',
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
      {data && !loading ? (
        <Fragment>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            // style={{ maxWidth: '318px' }}
            // width={'full'}
            paddingBottom={[3, 3, 4, 4]}
          >
            <FilterInput
              placeholder={formatMessage(m.search)}
              name="filterInput"
              value={search}
              onChange={handleChange}
            />
            <Box columnGap="gutter" display="flex" alignItems="center">
              <Button
                circle
                size="small"
                colorScheme="light"
                icon={'arrowBack'}
                onClick={() => handlePageChange('prev')}
              />
              <Text variant="eyebrow">
                {page * SESSION_LIMIT} - {page * SESSION_LIMIT + SESSION_LIMIT}
              </Text>
              <Button
                circle
                size="small"
                colorScheme="light"
                icon={'arrowForward'}
                onClick={() => handlePageChange('next')}
              />
            </Box>
          </Box>
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

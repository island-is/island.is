import {
  Box,
  Filter,
  FilterInput,
  FilterMultiChoice,
  Hidden,
  LoadingDots,
  Pagination,
  Text,
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

const Sessions = () => {
  const SESSION_LIMIT = 10
  const { formatMessage } = useLocale()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState<number>(1)

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

  const goToPage = (page = 1, scrollTop = true) => {
    setPage(page)

    if (scrollTop) {
      window.scrollTo(0, 0)
    }
  }

  return (
    <>
      <IntroHeader
        title={formatMessage(m.sessions)}
        intro={formatMessage(m.sessionsHeaderIntro)}
      />
      <Hidden above={'md'}>
        <Box columnGap="gutter" display="flex" paddingBottom={4}>
          <Box columnGap="smallGutter" display="flex" alignItems="center">
            <PersonIcon sessionType={SessionType.onBehalf} />
            <Text>Þú í umboði</Text>
          </Box>
          <Box columnGap="smallGutter" display="flex" alignItems="center">
            <PersonIcon sessionType={SessionType.myBehalf} />
            <Text>Aðrir í þínu umboði</Text>
          </Box>
        </Box>
      </Hidden>
      {data && !loading ? (
        <Fragment>
          <Box
            style={{ maxWidth: '318px' }}
            width={'full'}
            paddingBottom={[3, 3, 4, 4]}
          >
            <FilterInput
              placeholder={'Leita'}
              name="filterInput"
              value={search}
              onChange={handleChange}
            />
          </Box>
          <Hidden below={'lg'}>
            <HistoryTable data={data.sessionsList.data as SessionsSession[]} />
          </Hidden>
          <Hidden above={'md'}>
            <HistoryTableMobile
              sessions={data.sessionsList.data as SessionsSession[]}
            />
          </Hidden>
          <Box paddingTop={[3, 3, 4]}>
            <Pagination
              page={page}
              totalPages={data.sessionsList.totalCount}
              renderLink={(page, className, children) => (
                <button
                  onClick={() => {
                    goToPage(page)
                  }}
                >
                  <span className={helperStyles.srOnly}>Síða</span>
                  <span className={className}>{children}</span>
                </button>
              )}
            />
          </Box>
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

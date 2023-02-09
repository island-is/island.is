import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
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
import React, { Fragment, useRef, useState } from 'react'
import LogTable from '../../components/LogTable/LogTable'
import LogTableMobile from '../../components/LogTable/LogTableMobile'

import { m } from '../../lib/messages'
import { useGetSessionsListQuery } from './Sessions.generated'
import { SessionsSession } from '@island.is/api/schema'
import { SessionsPaths } from '../../lib/paths'
import * as kennitala from 'kennitala'
import useOnScreen from '../../utils/useOnScreen'

interface CursorState {
  before: string
  after: string
}

const Sessions = () => {
  const SESSION_LIMIT = 5

  const { formatMessage } = useLocale()

  const [sessionsData, setSessionsData] = useState<SessionsSession[]>([])
  const [searchNationalId, setSearchNationalId] = useState('')
  const [prevSearchNationalId, setPrevSearchNationalId] = useState('')
  const [sentNationalId, setSentNationalId] = useState('')
  const [page, setPage] = useState<CursorState>({ before: '', after: '' })
  const [isSearchingSSN, setIsSearchingSSN] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useOnScreen(ref)

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
    onCompleted: (data) => {
      setSessionsData([
        ...(sessionsData as SessionsSession[]),
        ...(data.sessionsList.data as SessionsSession[]),
      ])
      setIsSearchingSSN(false)
    },
    onError: () => {
      toast.error(formatMessage(m.error))
    },
  })

  React.useEffect(() => {
    if (!data || loading) return
    if (isVisible) {
      handlePageChange()
    }
  }, [isVisible])

  // If the search value changes, to a valid National ID, refetch the data with the National ID
  // Or if the search value changes from valid to invalid, refetch the data with empty National ID
  React.useEffect(() => {
    if (kennitala.isValid(searchNationalId)) {
      setSentNationalId(searchNationalId)
      setIsSearchingSSN(true)
      setSessionsData([])
    } else if (
      kennitala.isValid(prevSearchNationalId) &&
      !kennitala.isValid(searchNationalId)
    ) {
      setSentNationalId('')
      setIsSearchingSSN(true)
      setSessionsData([])
      setPage({ before: '', after: '' })
    }
  }, [searchNationalId])

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setPrevSearchNationalId(searchNationalId)
    setSearchNationalId(e.target.value)
  }

  const handlePageChange = (): void => {
    if (!data) return
    if (!data.sessionsList.pageInfo.hasNextPage) return

    setPage({
      after: data?.sessionsList.pageInfo.endCursor ?? '',
      before: '',
    })
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
      </Box>
      {data ? (
        <Fragment>
          <Hidden below={'lg'}>
            <LogTable data={sessionsData} />
          </Hidden>
          <Hidden above={'md'}>
            <LogTableMobile sessions={sessionsData} />
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
      <Box
        marginTop={'gutter'}
        display={'flex'}
        justifyContent={'center'}
        ref={ref}
      >
        {((loading && data) || isSearchingSSN) && <LoadingDots large />}
      </Box>
    </>
  )
}

export default Sessions

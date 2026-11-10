import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { parseAsInteger, useQueryState } from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  LoadingDots,
  Pagination,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type {
  ConnectedComponent,
  GetCourtOfAppealAppealsQuery,
  GetCourtOfAppealAppealsQueryVariables,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { GET_COURT_OF_APPEAL_APPEALS_QUERY } from '@island.is/web/screens/queries/CourtOfAppealAppeals'

import { m } from './translation.strings'

const ITEMS_PER_PAGE = 10
// Leaves room above the list so the page title stays in view
const SCROLL_OFFSET = 180

interface LandsretturCourtOfAppealAppealsProps {
  slice: ConnectedComponent
}

const LandsretturCourtOfAppealAppeals = ({
  slice: _slice,
}: LandsretturCourtOfAppealAppealsProps) => {
  const { formatMessage } = useIntl()
  const { format } = useDateUtils()
  const appealListTop = useRef<HTMLDivElement>(null)

  const [_page, setPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({
      clearOnDefault: true,
    }),
  )
  const page = _page ?? 1

  const [appeals, setAppeals] =
    useState<GetCourtOfAppealAppealsQuery['webCourtOfAppealAppeals']>()

  const [fetchAppeals, { loading, error }] = useLazyQuery<
    GetCourtOfAppealAppealsQuery,
    GetCourtOfAppealAppealsQueryVariables
  >(GET_COURT_OF_APPEAL_APPEALS_QUERY, {
    onCompleted(data) {
      setAppeals(data.webCourtOfAppealAppeals)
    },
  })

  useEffect(() => {
    fetchAppeals({
      variables: {
        input: { page },
      },
    })
  }, [page, fetchAppeals])

  return (
    <Stack space={3}>
      <div ref={appealListTop} />
      {loading && !appeals && (
        <SkeletonLoader
          height={150}
          width="100%"
          borderRadius="large"
          repeat={ITEMS_PER_PAGE}
          space={3}
        />
      )}
      {loading && appeals && (
        <Box display="flex" justifyContent="center">
          <LoadingDots />
        </Box>
      )}
      {error && (
        <AlertMessage
          type="error"
          title={formatMessage(m.fetchAppealsFailedTitle)}
          message={formatMessage(m.fetchAppealsFailedMessage)}
        />
      )}

      {appeals && (
        <Stack space={3}>
          {appeals.items.map((item) => (
            <Box
              key={item.id}
              background="white"
              borderColor="blue200"
              borderWidth="standard"
              borderRadius="large"
              padding={2}
            >
              <Stack space={2}>
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="flexStart"
                  flexWrap="wrap"
                  columnGap={2}
                  rowGap={1}
                >
                  <Text variant="h3">{item.caseNumber}</Text>
                  {item.status && (
                    <Text variant="medium" fontWeight="light">
                      {item.status}
                    </Text>
                  )}
                </Box>
                <Text variant="medium" fontWeight="light">
                  {item.title}
                </Text>
                {item.appealDate && (
                  <Text variant="medium" fontWeight="light">
                    {formatMessage(m.appealDatePrefix)}{' '}
                    {format(new Date(item.appealDate), 'd. MMMM yyyy')}
                  </Text>
                )}
              </Stack>
            </Box>
          ))}
          {appeals.total > ITEMS_PER_PAGE && (
            <Pagination
              page={page}
              totalItems={appeals.total}
              itemsPerPage={ITEMS_PER_PAGE}
              renderLink={(page, className, children) => (
                <button
                  className={className}
                  onClick={() => {
                    setPage(page)
                    const listTop = appealListTop.current
                    // Only scroll back up if the top of the list is out of view
                    if (!listTop || listTop.getBoundingClientRect().top >= 0)
                      return
                    window.scrollTo({
                      top:
                        listTop.getBoundingClientRect().top +
                        window.scrollY -
                        SCROLL_OFFSET,
                      behavior: 'instant',
                    })
                  }}
                >
                  {children}
                </button>
              )}
            />
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default LandsretturCourtOfAppealAppeals

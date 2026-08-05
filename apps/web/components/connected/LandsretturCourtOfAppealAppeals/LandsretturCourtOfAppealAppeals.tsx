import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type {
  ConnectedComponent,
  GetCourtOfAppealAppealsQuery,
} from '@island.is/web/graphql/schema'
import { GET_COURT_OF_APPEAL_APPEALS_QUERY } from '@island.is/web/screens/queries/CourtOfAppealAppeals'

import { m } from './translation.strings'

interface LandsretturCourtOfAppealAppealsProps {
  slice: ConnectedComponent
}

const DateField = ({ date }: { date: string }) => (
  <Text variant="medium" fontWeight="light">
    {date}
  </Text>
)

const renderDate = (value?: string | null) => {
  if (!value) return null
  return <DateField date={value} />
}

const LandsretturCourtOfAppealAppeals = ({
  slice: _slice,
}: LandsretturCourtOfAppealAppealsProps) => {
  const { formatMessage } = useIntl()
  const [appeals, setAppeals] =
    useState<GetCourtOfAppealAppealsQuery['webCourtOfAppealAppeals']>()

  const [fetchAppeals, { loading, error }] =
    useLazyQuery<GetCourtOfAppealAppealsQuery>(
      GET_COURT_OF_APPEAL_APPEALS_QUERY,
      {
        onCompleted(data) {
          setAppeals(data.webCourtOfAppealAppeals)
        },
      },
    )

  useEffect(() => {
    fetchAppeals()
  }, [fetchAppeals])

  return (
    <Stack space={3}>
      {loading && (
        <SkeletonLoader
          height={150}
          width="100%"
          borderRadius="large"
          repeat={10}
          space={3}
        />
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
                  {renderDate(item.verdictDate)}
                </Box>
                <Text variant="medium" fontWeight="light">
                  {item.title}
                </Text>
                {renderDate(item.appealDate)}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

export default LandsretturCourtOfAppealAppeals

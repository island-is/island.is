import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

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
  GetCourtOfAppealAppealsQueryVariables,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { GET_COURT_OF_APPEAL_APPEALS_QUERY } from '@island.is/web/screens/queries/CourtOfAppealAppeals'

import { m } from './translation.strings'

const SKELETON_ITEM_COUNT = 10

interface LandsretturCourtOfAppealAppealsProps {
  slice: ConnectedComponent
}

const LandsretturCourtOfAppealAppeals = ({
  slice: _slice,
}: LandsretturCourtOfAppealAppealsProps) => {
  const { formatMessage } = useIntl()
  const { format } = useDateUtils()

  const { data, loading, error } = useQuery<
    GetCourtOfAppealAppealsQuery,
    GetCourtOfAppealAppealsQueryVariables
  >(GET_COURT_OF_APPEAL_APPEALS_QUERY, { ssr: false })

  const appeals = data?.webCourtOfAppealAppeals

  return (
    <Stack space={3}>
      {loading && !appeals && (
        <SkeletonLoader
          height={150}
          width="100%"
          borderRadius="large"
          repeat={SKELETON_ITEM_COUNT}
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
        </Stack>
      )}
    </Stack>
  )
}

export default LandsretturCourtOfAppealAppeals

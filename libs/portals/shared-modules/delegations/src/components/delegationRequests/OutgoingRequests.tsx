import {
  Box,
  Button,
  SkeletonLoader,
  Stack,
  Table as T,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/portals/core'
import { AuthDelegationRequestStatus } from '@island.is/api/schema'

import { m } from '../../lib/messages'
import {
  useAuthDelegationRequestsOutgoingQuery,
  useCancelAuthDelegationRequestMutation,
  AuthDelegationRequestsOutgoingDocument,
} from './DelegationRequests.generated'

const statusMessage = {
  [AuthDelegationRequestStatus.pending]: m.requestStatusPending,
  [AuthDelegationRequestStatus.approved]: m.requestStatusApproved,
  [AuthDelegationRequestStatus.rejected]: m.requestStatusRejected,
  [AuthDelegationRequestStatus.cancelled]: m.requestStatusCancelled,
  [AuthDelegationRequestStatus.expired]: m.requestStatusExpired,
} as const

const statusVariant = {
  [AuthDelegationRequestStatus.pending]: 'blue',
  [AuthDelegationRequestStatus.approved]: 'mint',
  [AuthDelegationRequestStatus.rejected]: 'red',
  [AuthDelegationRequestStatus.cancelled]: 'disabled',
  [AuthDelegationRequestStatus.expired]: 'disabled',
} as const

export const OutgoingRequests = () => {
  const { formatMessage } = useLocale()

  const { data, loading } = useAuthDelegationRequestsOutgoingQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const [cancelRequest] = useCancelAuthDelegationRequestMutation({
    refetchQueries: [{ query: AuthDelegationRequestsOutgoingDocument }],
  })

  const requests = data?.authDelegationRequestsOutgoing ?? []

  const onCancel = (requestId: string) => {
    cancelRequest({ variables: { input: { requestId } } })
      .then(() => toast.success(formatMessage(m.requestCancelSuccess)))
      .catch(() => toast.error(formatMessage(m.requestCancelError)))
  }

  if (loading && !data) {
    return (
      <Box paddingTop={2}>
        <SkeletonLoader space={1} height={40} repeat={3} />
      </Box>
    )
  }

  if (requests.length === 0) {
    return null
  }

  return (
    <Box
      marginBottom={6}
      display="flex"
      flexDirection="column"
      rowGap={[0, 0, 0, 2]}
    >
      <Text variant="h5">{formatMessage(m.outgoingRequestsTitle)}</Text>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.requestTo)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.accessScopes)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.requestStatus)}
              </Text>
            </T.HeadData>
            <T.HeadData />
          </T.Row>
        </T.Head>
        <T.Body>
          {requests.map((request) => (
            <T.Row key={request.id}>
              <T.Data>
                <Text variant="medium">{request.to.name}</Text>
                <Text variant="small" color="dark400">
                  {formatNationalId(request.to.nationalId)}
                </Text>
              </T.Data>
              <T.Data>
                <Stack space={0}>
                  {request.scopes.map((scope) => (
                    <Text key={scope.scopeName} variant="medium">
                      {scope.displayName ?? scope.scopeName}
                    </Text>
                  ))}
                </Stack>
              </T.Data>
              <T.Data>
                <Tag variant={statusVariant[request.status]} disabled outlined>
                  {formatMessage(statusMessage[request.status])}
                </Tag>
              </T.Data>
              <T.Data>
                <Box display="flex" justifyContent="flexEnd">
                  {request.status === AuthDelegationRequestStatus.pending && (
                    <Button
                      variant="ghost"
                      colorScheme="destructive"
                      size="small"
                      onClick={() => onCancel(request.id)}
                    >
                      {formatMessage(m.requestCancel)}
                    </Button>
                  )}
                </Box>
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}

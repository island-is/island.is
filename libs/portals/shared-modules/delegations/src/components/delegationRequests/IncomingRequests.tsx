import { useNavigate } from 'react-router-dom'
import format from 'date-fns/format'

import {
  Box,
  Button,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/portals/core'

import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'
import { useDelegationForm } from '../../context'
import {
  useAuthDelegationRequestsIncomingQuery,
  useRejectAuthDelegationRequestMutation,
  AuthDelegationRequestsIncomingDocument,
} from './DelegationRequests.generated'

export const IncomingRequests = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { setIdentities, setPendingRequestId, setRequestedScopeNames, clearForm, skipNextClear } =
    useDelegationForm()

  const { data, loading } = useAuthDelegationRequestsIncomingQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const [rejectRequest] = useRejectAuthDelegationRequestMutation({
    refetchQueries: [{ query: AuthDelegationRequestsIncomingDocument }],
  })

  const requests = (data?.authDelegationRequestsIncoming ?? []).filter(
    (request) => request.status === 'pending',
  )

  const onReject = (requestId: string) => {
    rejectRequest({ variables: { input: { requestId } } })
      .then(() => toast.success(formatMessage(m.requestRejectSuccess)))
      .catch(() => toast.error(formatMessage(m.requestRejectError)))
  }

  const onApprove = (request: (typeof requests)[number]) => {
    // Reset any stale wizard state before seeding it, but keep the seeded
    // values across the navigation (clearForm runs on unmount).
    clearForm()
    setIdentities([{ nationalId: request.to.nationalId, name: request.to.name }])
    setRequestedScopeNames(request.scopes.map((scope) => scope.scopeName))
    setPendingRequestId(request.id)
    skipNextClear()
    navigate(DelegationPaths.DelegationsGrantNew)
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
      <Text variant="h5">{formatMessage(m.incomingRequestsTitle)}</Text>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.requestFrom)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.requestRelationshipHeader)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.requestReasonHeader)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.accessScopes)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.validTo)}
              </Text>
            </T.HeadData>
            <T.HeadData />
          </T.Row>
        </T.Head>
        <T.Body>
          {requests.map((request) => (
            <T.Row key={request.id}>
              <T.Data>
                <Text variant="medium">{request.from.name}</Text>
                <Text variant="small" color="dark400">
                  {formatNationalId(request.from.nationalId)}
                </Text>
              </T.Data>
              <T.Data>
                <Text variant="medium">{request.relationship}</Text>
              </T.Data>
              <T.Data>
                <Text variant="medium">{request.reason}</Text>
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
                <Text variant="medium">
                  {request.expiresAt
                    ? format(new Date(request.expiresAt), 'dd.MM.yyyy')
                    : '-'}
                </Text>
              </T.Data>
              <T.Data>
                <Box
                  display="flex"
                  flexDirection={['column', 'row']}
                  columnGap={1}
                  rowGap={1}
                  justifyContent="flexEnd"
                >
                  <Button
                    variant="ghost"
                    colorScheme="destructive"
                    size="small"
                    onClick={() => onReject(request.id)}
                  >
                    {formatMessage(m.requestReject)}
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => onApprove(request)}
                  >
                    {formatMessage(m.requestApprove)}
                  </Button>
                </Box>
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}

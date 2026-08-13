import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import format from 'date-fns/format'

import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Table as T,
  Text,
  toast,
  UserAvatar,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { m as coreMessages, formatNationalId } from '@island.is/portals/core'

import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'
import { useDelegationForm } from '../../context'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { ReviewRequestModal } from '../modals/ReviewRequestModal'
import {
  useAuthDelegationRequestsIncomingQuery,
  useRejectAuthDelegationRequestMutation,
  AuthDelegationRequestsIncomingDocument,
  AuthDelegationRequestsIncomingQuery,
} from './DelegationRequests.generated'

type IncomingRequest =
  AuthDelegationRequestsIncomingQuery['authDelegationRequestsIncoming'][number]

export const IncomingRequests = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const {
    setIdentities,
    setPendingRequestId,
    setRequestedScopeNames,
    clearForm,
    skipNextClear,
  } = useDelegationForm()

  const { data, loading } = useAuthDelegationRequestsIncomingQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const [rejectRequest, { loading: rejectLoading }] =
    useRejectAuthDelegationRequestMutation({
      refetchQueries: [{ query: AuthDelegationRequestsIncomingDocument }],
    })

  const requests = (data?.authDelegationRequestsIncoming ?? []).filter(
    (request) => request.status === 'pending',
  )

  const [requestToReview, setRequestToReview] =
    useState<IncomingRequest | null>(null)
  const [requestToReject, setRequestToReject] =
    useState<IncomingRequest | null>(null)

  const onRejectConfirm = () => {
    if (!requestToReject) {
      return
    }
    rejectRequest({ variables: { input: { requestId: requestToReject.id } } })
      .then(() => toast.success(formatMessage(m.requestRejectSuccess)))
      .catch(() => toast.error(formatMessage(m.requestRejectError)))
      .finally(() => setRequestToReject(null))
  }

  const onApprove = (request: IncomingRequest) => {
    // Reset any stale wizard state before seeding it, but keep the seeded
    // values across the navigation (clearForm runs on unmount).
    clearForm()
    setIdentities([
      { nationalId: request.to.nationalId, name: request.to.name },
    ])
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

  const headerArray = [
    { value: formatMessage(m.requestFrom) },
    { value: formatMessage(m.requestRelationshipHeader) },
    { value: formatMessage(m.requestScopeCount) },
    { value: formatMessage(m.requestDateSent) },
    { value: '' },
  ]

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
            {headerArray.map((item, i) => (
              <T.HeadData key={item.value + i}>
                <Text variant="medium" fontWeight="semiBold">
                  {item.value}
                </Text>
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          {requests.map((request) => (
            <T.Row key={request.id}>
              <T.Data>
                <Box display="flex" alignItems="center" columnGap={2}>
                  <UserAvatar color="blue" username={request.from.name} />
                  <Box>
                    <Text variant="medium">{request.from.name}</Text>
                    <Text variant="small" color="dark400">
                      {formatNationalId(request.from.nationalId)}
                    </Text>
                  </Box>
                </Box>
              </T.Data>
              <T.Data>
                <Text variant="medium">{request.relationship}</Text>
              </T.Data>
              <T.Data>
                <Text variant="medium" fontWeight="semiBold">
                  {request.scopes.length}
                </Text>
              </T.Data>
              <T.Data>
                <Text variant="medium">
                  {request.createdAt
                    ? format(new Date(request.createdAt), 'dd.MM.yyyy')
                    : '-'}
                </Text>
              </T.Data>
              <T.Data>
                <Box display="flex" justifyContent="flexEnd">
                  <Button
                    variant="text"
                    icon="arrowForward"
                    iconType="outline"
                    size="small"
                    onClick={() => setRequestToReview(request)}
                  >
                    {formatMessage(m.requestReviewButton)}
                  </Button>
                </Box>
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>

      <ReviewRequestModal
        request={requestToReview}
        onClose={() => setRequestToReview(null)}
        onApprove={(request) => {
          setRequestToReview(null)
          onApprove(request)
        }}
        onReject={(request) => {
          setRequestToReview(null)
          setRequestToReject(request)
        }}
      />

      <Modal
        id="reject-request-modal"
        label={formatMessage(m.requestRejectConfirmTitle)}
        title={formatMessage(m.requestRejectConfirmTitle)}
        onClose={() => setRequestToReject(null)}
        closeButtonLabel={formatMessage(m.closeModal)}
        isVisible={requestToReject !== null}
        eyebrow={formatMessage(coreMessages.digitalDelegations)}
      >
        <Box display="flex" flexDirection="column" rowGap={3} marginTop={2}>
          <Text>
            {formatMessage(m.requestRejectConfirmText, {
              name: requestToReject?.from.name,
            })}
          </Text>
          <AlertMessage
            type="info"
            message={formatMessage(m.requestRejectConfirmTracking)}
          />
        </Box>

        <Box position="sticky" bottom={0}>
          <DelegationsFormFooter
            loading={rejectLoading}
            showShadow={false}
            confirmButtonColorScheme="destructive"
            onCancel={() => setRequestToReject(null)}
            onConfirm={onRejectConfirm}
            containerPaddingBottom={[3, 3, 4]}
            confirmLabel={formatMessage(m.requestRejectConfirmButton)}
          />
        </Box>
      </Modal>
    </Box>
  )
}

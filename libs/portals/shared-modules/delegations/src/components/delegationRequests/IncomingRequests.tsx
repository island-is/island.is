import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Table as T,
  Tag,
  Text,
  toast,
  UserAvatar,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { m as coreMessages, formatNationalId } from '@island.is/portals/core'
import { AuthDelegationRequestStatus } from '@island.is/api/schema'

import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { ReviewRequestModal } from '../modals/ReviewRequestModal'
import { RequestSectionHeader } from './RequestSectionHeader'
import { requestStatusTag } from './requestStatusTag'
import * as styles from './DelegationRequests.css'
import {
  useAuthDelegationRequestsIncomingQuery,
  useRejectAuthDelegationRequestMutation,
  AuthDelegationRequestsIncomingDocument,
  AuthDelegationRequestsIncomingQuery,
} from './DelegationRequests.generated'

type IncomingRequest =
  AuthDelegationRequestsIncomingQuery['authDelegationRequestsIncoming'][number]

const matchesSearch = (request: IncomingRequest, search: string) => {
  if (!search) return true
  const term = search.toLowerCase()
  return (
    request.to.name.toLowerCase().includes(term) ||
    request.to.nationalId.includes(term.replace('-', ''))
  )
}

export const IncomingRequests = ({ search = '' }: { search?: string }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { data, loading } = useAuthDelegationRequestsIncomingQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const [rejectRequest, { loading: rejectLoading }] =
    useRejectAuthDelegationRequestMutation({
      refetchQueries: [{ query: AuthDelegationRequestsIncomingDocument }],
    })

  const requests = (data?.authDelegationRequestsIncoming ?? []).filter(
    (request) =>
      request.status !== AuthDelegationRequestStatus.cancelled &&
      matchesSearch(request, search),
  )

  const [requestToReview, setRequestToReview] =
    useState<IncomingRequest | null>(null)
  const [requestToReject, setRequestToReject] =
    useState<IncomingRequest | null>(null)

  const onRejectConfirm = () => {
    if (!requestToReject) return
    rejectRequest({ variables: { input: { requestId: requestToReject.id } } })
      .then(() => toast.success(formatMessage(m.requestRejectSuccess)))
      .catch(() => toast.error(formatMessage(m.requestRejectError)))
      .finally(() => setRequestToReject(null))
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
    <Box marginBottom={6}>
      <RequestSectionHeader
        direction="incoming"
        title={formatMessage(m.incomingRequestsSectionTitle)}
        subtitle={formatMessage(m.incomingRequestsSectionSubtitle)}
      />
      <div className={styles.tableContainer}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                <Text variant="medium" fontWeight="semiBold">
                  {formatMessage(m.name)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text variant="medium" fontWeight="semiBold">
                  {formatMessage(m.colDateReceived)}
                </Text>
              </T.HeadData>
              <T.HeadData />
            </T.Row>
          </T.Head>
          <T.Body>
            {requests.map((request) => (
              <T.Row key={request.id}>
                <T.Data>
                  <Box display="flex" alignItems="center" columnGap={2}>
                    <UserAvatar color="blue" username={request.to.name} />
                    <Box>
                      <Text variant="medium">{request.to.name}</Text>
                      <Text variant="small" color="dark400">
                        {formatNationalId(request.to.nationalId)}
                      </Text>
                    </Box>
                  </Box>
                </T.Data>
                <T.Data>
                  <Text variant="medium">
                    {request.createdAt
                      ? format(new Date(request.createdAt), 'd. MMMM yyyy', {
                          locale: is,
                        })
                      : '-'}
                  </Text>
                </T.Data>
                <T.Data>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flexEnd"
                    columnGap={3}
                  >
                    {request.status !== AuthDelegationRequestStatus.pending &&
                      requestStatusTag[request.status] && (
                        <Tag
                          variant={requestStatusTag[request.status]!.variant}
                          outlined
                          disabled
                        >
                          {formatMessage(
                            requestStatusTag[request.status]!.label,
                          )}
                        </Tag>
                      )}
                    <Button
                      variant="text"
                      icon="arrowForward"
                      size="small"
                      onClick={() => setRequestToReview(request)}
                    >
                      {formatMessage(m.reviewBeidniButton)}
                    </Button>
                  </Box>
                </T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      </div>

      <ReviewRequestModal
        request={requestToReview}
        readOnly={
          !!requestToReview &&
          requestToReview.status !== AuthDelegationRequestStatus.pending
        }
        onClose={() => setRequestToReview(null)}
        onReject={(request) => {
          setRequestToReview(null)
          setRequestToReject(request)
        }}
        onViewDelegation={() => {
          setRequestToReview(null)
          navigate(DelegationPaths.DelegationsNew)
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
              name: requestToReject?.to.name,
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

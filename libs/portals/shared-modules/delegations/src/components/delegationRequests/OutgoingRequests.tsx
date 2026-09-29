import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

import {
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
import { formatNationalId } from '@island.is/portals/core'
import { AuthDelegationRequestStatus } from '@island.is/api/schema'

import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'
import { RequestSectionHeader } from './RequestSectionHeader'
import { ReviewRequestModal } from '../modals/ReviewRequestModal'
import { requestStatusTag } from './requestStatusTag'
import * as styles from './DelegationRequests.css'
import {
  useAuthDelegationRequestsOutgoingQuery,
  useCancelAuthDelegationRequestMutation,
  AuthDelegationRequestsOutgoingDocument,
  AuthDelegationRequestsOutgoingQuery,
} from './DelegationRequests.generated'

type OutgoingRequest =
  AuthDelegationRequestsOutgoingQuery['authDelegationRequestsOutgoing'][number]

const matchesSearch = (request: OutgoingRequest, search: string) => {
  if (!search) return true
  const term = search.toLowerCase()
  return (
    request.from.name.toLowerCase().includes(term) ||
    request.from.nationalId.includes(term.replace('-', ''))
  )
}

export const OutgoingRequests = ({ search = '' }: { search?: string }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { data, loading } = useAuthDelegationRequestsOutgoingQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const [cancelRequest] = useCancelAuthDelegationRequestMutation({
    refetchQueries: [{ query: AuthDelegationRequestsOutgoingDocument }],
  })

  const [requestToView, setRequestToView] = useState<OutgoingRequest | null>(
    null,
  )

  const requests = (data?.authDelegationRequestsOutgoing ?? []).filter(
    (request) => matchesSearch(request, search),
  )

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
    <Box marginBottom={6}>
      <RequestSectionHeader
        direction="outgoing"
        title={formatMessage(m.outgoingRequestsSectionTitle)}
        subtitle={formatMessage(m.outgoingRequestsSectionSubtitle)}
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
                  {formatMessage(m.colDateSent)}
                </Text>
              </T.HeadData>
              <T.HeadData />
            </T.Row>
          </T.Head>
          <T.Body>
            {requests.map((request) => {
              const tag = requestStatusTag[request.status]
              return (
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
                      {request.status !==
                        AuthDelegationRequestStatus.pending &&
                        tag && (
                          <Tag variant={tag.variant} outlined disabled>
                            {formatMessage(tag.label)}
                          </Tag>
                        )}
                      {request.status ===
                        AuthDelegationRequestStatus.pending && (
                        <Button
                          variant="text"
                          icon="trash"
                          iconType="outline"
                          size="small"
                          colorScheme="destructive"
                          onClick={() => onCancel(request.id)}
                        >
                          {formatMessage(m.requestCancel)}
                        </Button>
                      )}
                      <Button
                        variant="text"
                        icon="arrowForward"
                        size="small"
                        onClick={() => setRequestToView(request)}
                      >
                        {formatMessage(m.reviewBeidniButton)}
                      </Button>
                    </Box>
                  </T.Data>
                </T.Row>
              )
            })}
          </T.Body>
        </T.Table>
      </div>

      <ReviewRequestModal
        readOnly
        direction="outgoing"
        request={requestToView}
        onClose={() => setRequestToView(null)}
        onCancel={(request) => {
          onCancel(request.id)
          setRequestToView(null)
        }}
        onViewDelegation={() => {
          setRequestToView(null)
          navigate(DelegationPaths.DelegationsNew)
        }}
      />
    </Box>
  )
}

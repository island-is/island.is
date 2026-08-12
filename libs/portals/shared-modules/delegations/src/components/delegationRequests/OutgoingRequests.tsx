import { useState } from 'react'
import format from 'date-fns/format'

import {
  Box,
  Button,
  SkeletonLoader,
  Table as T,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { AuthDelegationRequestStatus } from '@island.is/api/schema'

import { m } from '../../lib/messages'
import ExpandableRow from '../tables/ExpandableRow/ExpandableRow'
import { IdentityInfo } from '../tables/IdentityInfo/IdentityInfo'
import * as styles from '../tables/Tables.css'
import {
  useAuthDelegationRequestsOutgoingQuery,
  useCancelAuthDelegationRequestMutation,
  AuthDelegationRequestsOutgoingDocument,
  AuthDelegationRequestsOutgoingQuery,
} from './DelegationRequests.generated'

type OutgoingRequest =
  AuthDelegationRequestsOutgoingQuery['authDelegationRequestsOutgoing'][number]

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

const RequestScopesTable = ({
  scopes,
}: {
  scopes: OutgoingRequest['scopes']
}) => {
  const { formatMessage } = useLocale()

  return (
    <div className={styles.tableContainer}>
      <T.Table>
        <T.Head>
          <T.Row>
            {[
              formatMessage(m.headerDomain),
              formatMessage(m.headerScopeName),
              formatMessage(m.headerValidityPeriod),
            ].map((value, i) => (
              <T.HeadData key={value + i} style={{ paddingInline: 16 }}>
                <Text variant="medium" fontWeight="semiBold">
                  {value}
                </Text>
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          {scopes.map((scope) => (
            <T.Row key={scope.scopeName}>
              <T.Data style={{ paddingInline: 16, wordBreak: 'break-word' }}>
                <Text variant="medium">{scope.domainDisplayName}</Text>
              </T.Data>
              <T.Data style={{ paddingInline: 16, wordBreak: 'break-word' }}>
                <Text variant="medium">
                  {scope.displayName ?? scope.scopeName}
                </Text>
              </T.Data>
              <T.Data style={{ paddingInline: 16 }}>
                <Text variant="medium">
                  {scope.validTo
                    ? format(new Date(scope.validTo), 'dd.MM.yyyy')
                    : '-'}
                </Text>
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </div>
  )
}

export const OutgoingRequests = () => {
  const { formatMessage } = useLocale()
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

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

  const headerArray = [
    { value: '' },
    { value: formatMessage(m.requestTo) },
    { value: formatMessage(m.requestScopeCount) },
    { value: formatMessage(m.requestDateSent) },
    { value: formatMessage(m.requestStatus) },
    { value: '' },
  ]

  return (
    <Box
      marginBottom={6}
      display="flex"
      flexDirection="column"
      rowGap={[0, 0, 0, 2]}
    >
      <Text variant="h5">{formatMessage(m.outgoingRequestsTitle)}</Text>
      <div className={styles.tableContainer}>
        <T.Table>
          <T.Head>
            <T.Row>
              {headerArray.map((item, i) => (
                <T.HeadData key={item.value + i} style={{ paddingInline: 16 }}>
                  <Text variant="medium" fontWeight="semiBold">
                    {item.value}
                  </Text>
                </T.HeadData>
              ))}
            </T.Row>
          </T.Head>
          <T.Body>
            {requests.map((request) => (
              <ExpandableRow
                key={request.id}
                onExpandCallback={() => setExpandedRow(request.id)}
                data={[
                  {
                    value: (
                      <IdentityInfo
                        identity={{
                          nationalId: request.to.nationalId,
                          name: request.to.name,
                        }}
                        isExpanded={expandedRow === request.id}
                      />
                    ),
                  },
                  {
                    value: (
                      <Text variant="medium" fontWeight="semiBold">
                        {request.scopes.length}
                      </Text>
                    ),
                  },
                  {
                    value: request.createdAt
                      ? format(new Date(request.createdAt), 'dd.MM.yyyy')
                      : '-',
                  },
                  {
                    value: (
                      <Tag
                        variant={statusVariant[request.status]}
                        disabled
                        outlined
                      >
                        {formatMessage(statusMessage[request.status])}
                      </Tag>
                    ),
                  },
                  {
                    value: (
                      <Box flexShrink={0} display="flex" columnGap={2}>
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
                      </Box>
                    ),
                    align: 'right',
                  },
                ]}
              >
                <RequestScopesTable scopes={request.scopes} />
              </ExpandableRow>
            ))}
          </T.Body>
        </T.Table>
      </div>
    </Box>
  )
}

import format from 'date-fns/format'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { m as coreMessages, formatNationalId } from '@island.is/portals/core'

import { m } from '../../lib/messages'
import { IdentityCard } from '../IdentityCard/IdentityCard'
import { RequestScopesTable } from '../delegationRequests/RequestScopesTable'
import { AuthDelegationRequestsIncomingQuery } from '../delegationRequests/DelegationRequests.generated'

type IncomingRequest =
  AuthDelegationRequestsIncomingQuery['authDelegationRequestsIncoming'][number]

/**
 * Review an incoming delegation request: who is asking, their stated
 * relationship and reason, and the scopes as the rows they would become
 * once granted — with approve/reject actions.
 */
export const ReviewRequestModal = ({
  request,
  onClose,
  onApprove,
  onReject,
}: {
  request: IncomingRequest | null
  onClose: () => void
  onApprove: (request: IncomingRequest) => void
  onReject: (request: IncomingRequest) => void
}) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id="review-request-modal"
      label={formatMessage(m.requestReviewTitle)}
      title={formatMessage(m.requestReviewTitle)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      isVisible={request !== null}
      eyebrow={formatMessage(coreMessages.digitalDelegations)}
    >
      {request && (
        <>
          <Box
            display="flex"
            flexDirection="column"
            rowGap={[3, 3, 4]}
            marginTop={2}
          >
            <IdentityCard
              label={formatMessage(m.requestFrom)}
              title={request.from.name}
              description={formatNationalId(request.from.nationalId)}
              color="blue"
            />
            <Box display="flex" flexDirection="column" rowGap={1}>
              <Text variant="h5">
                {formatMessage(m.requestRelationshipHeader)}
              </Text>
              <Text variant="default">{request.relationship}</Text>
            </Box>
            <Box display="flex" flexDirection="column" rowGap={1}>
              <Text variant="h5">{formatMessage(m.requestReasonHeader)}</Text>
              <Text variant="default">{request.reason}</Text>
            </Box>
            <Box display="flex" flexDirection="column" rowGap={[1, 1, 2]}>
              <Text variant="h5">{formatMessage(m.accessScopes)}</Text>
              <RequestScopesTable scopes={request.scopes} />
            </Box>
            {request.expiresAt && (
              <Text variant="small" color="dark400">
                {`${formatMessage(m.requestExpiresAt)}: ${format(
                  new Date(request.expiresAt),
                  'dd.MM.yyyy',
                )}`}
              </Text>
            )}
          </Box>

          <Box position="sticky" bottom={0} background="white" paddingTop={4}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="spaceBetween"
              width="full"
              paddingBottom={[3, 3, 4]}
            >
              <Button
                variant="ghost"
                colorScheme="destructive"
                onClick={() => onReject(request)}
              >
                {formatMessage(m.requestReject)}
              </Button>
              <Button
                variant="primary"
                icon="checkmark"
                onClick={() => onApprove(request)}
              >
                {formatMessage(m.requestApprove)}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Modal>
  )
}

import { Modal } from '@island.is/react/components'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m as coreMessages } from '@island.is/portals/core'

import { m } from '../../lib/messages'
import { useDelegationForm } from '../../context'
import { ScopesTable } from '../ScopesTable/ScopesTable'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { useCreateAuthDelegationRequestMutation } from '../delegationRequests/DelegationRequests.generated'
import * as styles from './Modals.css'

export const RequestConfirmModal = ({
  isVisible,
  onClose,
  relationship,
  reason,
  onSuccess,
  onError,
}: {
  isVisible: boolean
  onClose: () => void
  relationship: string
  reason: string
  onSuccess: () => void
  onError: () => void
}) => {
  const { formatMessage } = useLocale()
  const { identities, selectedScopes } = useDelegationForm()

  const [createRequest, { loading }] = useCreateAuthDelegationRequestMutation()

  const granter = identities[0]

  const handleConfirm = () => {
    if (!granter) {
      onError()
      return
    }

    createRequest({
      variables: {
        input: {
          toGranterNationalId: granter.nationalId,
          relationship,
          reason,
          scopes: selectedScopes.map((scope) => ({
            scopeName: scope.name,
            validTo: scope.validTo,
          })),
        },
      },
    })
      .then(() => onSuccess())
      .catch(() => onError())
  }

  return (
    <Modal
      id="confirm-request-modal"
      label={formatMessage(m.requestConfirmTitle)}
      title={formatMessage(m.requestConfirmTitle)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      isVisible={isVisible}
      eyebrow={formatMessage(coreMessages.digitalDelegations)}
    >
      <Box display="flex" flexDirection="column" rowGap={[3, 3, 4]}>
        {granter && (
          <div className={styles.idCard}>
            <Text variant="eyebrow">{formatMessage(m.requestTo)}</Text>
            <Box>
              <Text variant="h5">{granter.name}</Text>
              <Text variant="default">{`kt. ${granter.nationalId}`}</Text>
            </Box>
          </div>
        )}
        <Box display="flex" flexDirection="column" rowGap={1}>
          <Text variant="h5">{formatMessage(m.requestRelationshipHeader)}</Text>
          <Text variant="default">{relationship}</Text>
        </Box>
        <Box display="flex" flexDirection="column" rowGap={1}>
          <Text variant="h5">{formatMessage(m.requestReasonHeader)}</Text>
          <Text variant="default">{reason}</Text>
        </Box>
        <Box display="flex" flexDirection="column" rowGap={[1, 1, 2]}>
          <Text variant="h5">
            {formatMessage(m.selectedScopesWithValidityPeriod)}:
          </Text>
          <ScopesTable showDate editableDates={false} />
        </Box>
      </Box>

      <Box position="sticky" bottom={0}>
        <DelegationsFormFooter
          loading={loading}
          showShadow={false}
          onCancel={onClose}
          onConfirm={handleConfirm}
          confirmLabel={formatMessage(m.requestConfirmButtonLabel)}
          confirmIcon="checkmark"
          containerPaddingBottom={[3, 3, 6]}
          divider={false}
        />
      </Box>
    </Modal>
  )
}

import { useState } from 'react'

import { Modal } from '@island.is/react/components'
import { useLocale } from '@island.is/localization'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { m as coreMessages } from '@island.is/portals/core'

import { m } from '../../lib/messages'
import { getCreateRequestErrorMessage } from '../../lib/delegationRequestErrors'
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
}: {
  isVisible: boolean
  onClose: () => void
  relationship: string
  reason: string
  onSuccess: () => void
}) => {
  const { formatMessage } = useLocale()
  const { identities, selectedScopes } = useDelegationForm()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [createRequest, { loading }] = useCreateAuthDelegationRequestMutation()

  const granters = identities.filter((identity) => identity.nationalId)

  const handleConfirm = async () => {
    if (granters.length === 0) {
      setErrorMessage(formatMessage(m.requestError))
      return
    }

    setErrorMessage(null)

    const results = await Promise.allSettled(
      granters.map((granter) =>
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
        }),
      ),
    )

    const failures = results
      .map((result, index) => ({ result, granter: granters[index] }))
      .filter(({ result }) => result.status === 'rejected')

    if (failures.length === 0) {
      onSuccess()
      return
    }

    setErrorMessage(
      failures
        .map(({ result, granter }) => {
          const reasonText = formatMessage(
            getCreateRequestErrorMessage(
              (result as PromiseRejectedResult).reason,
            ),
          )
          return granters.length > 1
            ? `${granter.name || granter.nationalId}: ${reasonText}`
            : reasonText
        })
        .join('\n'),
    )
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
        {granters.map((granter) => (
          <div key={granter.nationalId} className={styles.idCard}>
            <Text variant="eyebrow">{formatMessage(m.requestTo)}</Text>
            <Box>
              <Text variant="h5">{granter.name}</Text>
              <Text variant="default">{`kt. ${granter.nationalId}`}</Text>
            </Box>
          </div>
        ))}
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
        {errorMessage && <AlertMessage type="error" message={errorMessage} />}
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

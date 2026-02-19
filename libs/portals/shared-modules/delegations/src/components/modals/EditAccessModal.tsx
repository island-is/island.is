import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { m } from '../../lib/messages'
import { m as coreMessages } from '@island.is/portals/core'
import { Identity, ScopeSelection } from '../../context'
import { EditScopesTable } from '../ScopesTable/EditScopesTable'
import { Box, Button } from '@island.is/island-ui/core'

export type EditAccessInitialValues = {
  identity: Identity
  scopes: ScopeSelection[]
}

export const EditAccessModal = ({
  onClose,
  isVisible,
  onConfirm,
  loading,
}: {
  onClose: () => void
  isVisible: boolean
  onConfirm: () => void
  loading: boolean
}) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id="edit-access-modal"
      // Todo: translate
      label="Breyta umboði"
      // title={formatMessage(m.editAccessModalTitle)}
      title="Breyta umboði"
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      isVisible={isVisible}
      eyebrow={formatMessage(coreMessages.digitalDelegations)}
    >
      <Box marginTop={4}>
        <EditScopesTable />
      </Box>
      <Box
        position="sticky"
        bottom={0}
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        paddingTop={4}
        paddingBottom={4}
        background="white"
      >
        <Button size="medium" variant="ghost" onClick={onClose}>
          {formatMessage(coreMessages.buttonCancel)}
        </Button>
        <Box display="flex" columnGap={3}>
          <Button size="medium" variant="primary">
            {/* Todo: translate */}
            Bæta við réttindum
          </Button>
          <Button
            variant="primary"
            loading={loading}
            icon="checkmark"
            size="small"
            colorScheme="default"
            onClick={onConfirm}
          >
            {formatMessage(coreMessages.codeConfirmation)}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

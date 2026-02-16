import { Modal } from '@island.is/react/components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { ActionCard, Box, useBreakpoint } from '@island.is/island-ui/core'
import { m as coreMessages } from '@island.is/portals/core'
import { useDynamicShadow } from '../../hooks/useDynamicShadow'
import { useDelegationForm } from '../../context'
import { DateScopesTable } from '../ScopesTable/DateScopesTable'

export const ConfirmAccessModal = ({
  onClose,
  onConfirm,
  isVisible,
}: {
  onClose: () => void
  onConfirm: () => void
  isVisible: boolean
}) => {
  const { formatMessage } = useLocale()

  const { identities } = useDelegationForm()

  return (
    // todo: translate
    <Modal
      id="confirm-access-modal"
      label="Confirm Access"
      title="Staðfesta veitingu á nýju umboði"
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      isVisible={isVisible}
      eyebrow="Rafræn umboð"
    >
      <Box display="flex" flexDirection="column" rowGap={4}>
        <Box
          alignSelf="flexStart"
          display="flex"
          rowGap={2}
          columnGap={2}
          flexWrap="wrap"
        >
          {identities.map((identity) => {
            return (
              <ActionCard
                key={identity.nationalId}
                heading={identity.name}
                text={identity.nationalId}
              />
            )
          })}
        </Box>
        <DateScopesTable editableDates={false} />
      </Box>

      <Box position="sticky" bottom={0}>
        <DelegationsFormFooter
          // loading={loading}
          showShadow={false}
          onCancel={onClose}
          // onConfirm={onConfirmHandler}
          confirmLabel={formatMessage(coreMessages.codeConfirmation)}
          confirmIcon="checkmark"
          containerPaddingBottom={[3, 3, 6]}
          divider={false}
        />
      </Box>
    </Modal>
  )
}

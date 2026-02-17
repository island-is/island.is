import { Modal } from '@island.is/react/components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { ActionCard, Box } from '@island.is/island-ui/core'
import { m as coreMessages } from '@island.is/portals/core'
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
      label="Confirm Access" // TODO: Translate
      title="Staðfesta veitingu á nýju umboði" // TODO: Translate
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      isVisible={isVisible}
      eyebrow="Rafræn umboð" // TODO: Translate
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
              <div
                style={{
                  flexBasis:
                    identities.length >= 3 ? 'calc(33% - 9px)' : 'auto',
                }}
              >
                <ActionCard
                  key={identity.nationalId}
                  heading={identity.name}
                  text={`kt. ${identity.nationalId}`}
                />
              </div>
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

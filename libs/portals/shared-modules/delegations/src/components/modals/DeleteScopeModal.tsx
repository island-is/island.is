import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Modal } from '@island.is/react/components'
import { AuthDelegationScope } from '@island.is/api/schema'
import { m } from '../../lib/messages'
import { m as coreMessages, formatNationalId } from '@island.is/portals/core'
import { IdentityCard } from '../IdentityCard/IdentityCard'

export const DeleteScopeModal = ({
  onClose,
  isVisible,
  direction,
  scope,
  onDelete,
  nationalId,
  name,
}: {
  onClose: () => void
  isVisible: boolean
  scope: AuthDelegationScope | null
  direction: 'outgoing' | 'incoming'
  onDelete: () => void
  nationalId: string
  name: string
}) => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  console.log('scope', scope)

  const from =
    direction === 'outgoing'
      ? {
          name: userInfo?.profile.name,
          nationalId: userInfo?.profile.nationalId,
        }
      : { name: name, nationalId: nationalId }
  const to =
    direction === 'outgoing'
      ? { name: name, nationalId: nationalId }
      : {
          name: userInfo?.profile.name,
          nationalId: userInfo?.profile.nationalId,
        }
  return (
    <Modal
      id="delete-scope-modal"
      label="Delete scope"
      title="Delete scope"
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      isVisible={isVisible}
      eyebrow={formatMessage(coreMessages.digitalDelegations)}
    >
      <Box
        width="full"
        display="flex"
        flexDirection={['column', 'column', 'column', 'row']}
        rowGap={[3, 3, 3, 0]}
        columnGap={[0, 0, 0, 3]}
        marginBottom={6}
        marginTop={2}
      >
        {from && (
          <IdentityCard
            label={formatMessage(m.accessOwner)}
            title={from.name}
            description={formatNationalId(from.nationalId)}
            color="blue"
          />
        )}
        {to && (
          <IdentityCard
            label={formatMessage(m.accessHolder)}
            title={to.name}
            description={formatNationalId(to.nationalId)}
            color="purple"
          />
        )}
      </Box>
    </Modal>
  )
}

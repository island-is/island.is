import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { m } from '../../lib/messages'
import { m as coreMessages, formatNationalId } from '@island.is/portals/core'
import { DelegationsByPerson } from '../delegations/table/CustomDelegationsTable'
import { useUserInfo } from '@island.is/react-spa/bff'
import { IdentityCard } from '../IdentityCard/IdentityCard'
import { Box } from '@island.is/island-ui/core'
import { DateScopesTable } from '../ScopesTable/DateScopesTable'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'

export const DeleteAccessModal = ({
  onClose,
  isVisible,
  onDelete,
  loading,
  person,
  direction,
}: {
  onClose: () => void
  isVisible: boolean
  onDelete: () => void
  loading: boolean
  person: DelegationsByPerson | null
  direction: 'outgoing' | 'incoming'
}) => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()

  if (!person) return null

  const from =
    direction === 'outgoing'
      ? {
          name: userInfo?.profile.name,
          nationalId: userInfo?.profile.nationalId,
        }
      : { name: person?.name, nationalId: person?.nationalId }
  const to =
    direction === 'outgoing'
      ? { name: person?.name, nationalId: person?.nationalId }
      : {
          name: userInfo?.profile.name,
          nationalId: userInfo?.profile.nationalId,
        }

  return (
    <Modal
      id="delete-access-modal"
      // Todo: translate
      label="Delete access"
      title="Delete access"
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

      <DateScopesTable editableDates={false} />

      <Box position="sticky" bottom={0}>
        <DelegationsFormFooter
          loading={loading}
          showShadow={false}
          confirmButtonColorScheme="destructive"
          onCancel={onClose}
          onConfirm={onDelete}
          containerPaddingBottom={[3, 3, 4]}
          confirmLabel={formatMessage(m.deleteAccess)}
        />
      </Box>
    </Modal>
  )
}

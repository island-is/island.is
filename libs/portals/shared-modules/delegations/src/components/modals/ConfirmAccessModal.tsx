import { Modal } from '@island.is/react/components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { ActionCard, Box } from '@island.is/island-ui/core'
import { m as coreMessages } from '@island.is/portals/core'
import { useDelegationForm } from '../../context'
import { DateScopesTable } from '../ScopesTable/DateScopesTable'
import { DelegationPaths } from '../../lib/paths'
import { useCreateAuthDelegationsMutation } from '../../screens/GrantAccessNew/GrantAccessNew.generated'
import { useNavigate } from 'react-router-dom'

export const ConfirmAccessModal = ({
  onClose,
  onConfirm,
  isVisible,
  loading,
}: {
  onClose: () => void
  onConfirm?: () => void
  isVisible: boolean
  loading?: boolean
}) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { identities, selectedScopes } = useDelegationForm()

  const [createAuthDelegations, { loading: mutationLoading }] =
    useCreateAuthDelegationsMutation()

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      const scopes = selectedScopes
        .map((scope) => {
          if (!scope.domain?.name || !scope.validTo) {
            return null
          }
          return {
            name: scope.name,
            validTo: scope.validTo,
            domainName: scope.domain.name,
          }
        })
        .filter((scope) => scope !== null)

      createAuthDelegations({
        variables: {
          input: {
            toNationalIds: identities.map((identity) => identity.nationalId),
            scopes,
          },
        },
      }).then(() => {
        navigate(DelegationPaths.DelegationsNew)
      })
    }
  }

  return (
    <Modal
      id="confirm-access-modal"
      label={formatMessage(coreMessages.codeConfirmation)}
      title={formatMessage(m.confirmAccessModalTitle)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      isVisible={isVisible}
      eyebrow={formatMessage(coreMessages.digitalDelegations)}
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
                key={identity.nationalId}
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
          loading={loading || mutationLoading}
          showShadow={false}
          onCancel={onClose}
          onConfirm={handleConfirm}
          confirmLabel={formatMessage(coreMessages.codeConfirmation)}
          confirmIcon="checkmark"
          containerPaddingBottom={[3, 3, 6]}
          divider={false}
        />
      </Box>
    </Modal>
  )
}

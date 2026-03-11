import { Modal } from '@island.is/react/components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { Box, Text } from '@island.is/island-ui/core'
import { m as coreMessages } from '@island.is/portals/core'
import { useDelegationForm } from '../../context'
import { ScopesTable } from '../ScopesTable/ScopesTable'
import { DelegationPaths } from '../../lib/paths'
import { useCreateAuthDelegationsMutation } from '../../screens/GrantAccessNew/GrantAccessNew.generated'
import { useNavigate } from 'react-router-dom'
import * as styles from './Modals.css'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

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
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.lg
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
      <Box display="flex" flexDirection="column" rowGap={[3, 3, 4]}>
        <Box
          alignSelf={['stretch', 'stretch', 'flexStart']}
          display="flex"
          rowGap={2}
          columnGap={2}
          flexWrap={['nowrap', 'nowrap', 'wrap']}
          flexDirection={['column', 'column', 'row']}
        >
          {identities.map((identity) => {
            return (
              <div
                key={identity.nationalId}
                className={styles.idCard}
                style={{
                  flexBasis:
                    identities.length >= 3 && !isMobile
                      ? 'calc(33% - 9px)'
                      : 'auto',
                }}
              >
                <Text variant="eyebrow">
                  {formatMessage(m.accessHolder)}
                  {identities.length > 1
                    ? ` ${identities.indexOf(identity) + 1}`
                    : ''}
                </Text>
                <Box>
                  <Text variant="h5">{identity.name}</Text>
                  <Text variant="default">{`kt. ${identity.nationalId}`}</Text>
                </Box>
              </div>
            )
          })}
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

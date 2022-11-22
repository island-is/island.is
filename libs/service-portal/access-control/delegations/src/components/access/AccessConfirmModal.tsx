import { isDefined } from '@island.is/shared/utils'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import { AlertBanner, Box, Text } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import {
  AuthDelegationScope,
  AuthScopeTreeQuery,
} from '@island.is/service-portal/graphql'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/service-portal/core'
import { useState } from 'react'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { Modal, ModalProps } from '../Modal/Modal'
import { AccessList } from './AccessList/AccessList'
import { IdentityCard } from '../IdentityCard/IdentityCard'

type AccessConfirmModalProps = Pick<ModalProps, 'onClose' | 'isVisible'> & {
  delegation: AuthCustomDelegation
  scopes?: Pick<AuthDelegationScope, 'name' | 'validTo' | 'displayName'>[]
  scopeTree: AuthScopeTreeQuery['authScopeTree']
  validityPeriod?: Date | null
  loading: boolean
  error?: boolean
  onConfirm(): Promise<void>
}

export const AccessConfirmModal = ({
  delegation,
  scopeTree,
  onClose,
  onConfirm,
  scopes,
  validityPeriod,
  loading,
  error: formError,
  ...rest
}: AccessConfirmModalProps) => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const [error, setError] = useState(formError ?? false)

  const onConfirmHandler = async () => {
    if (!delegation.id || !scopes) {
      setError(true)
      return
    }

    onConfirm()
  }

  if (isDefined(formError) && formError !== error) {
    setError(formError)
  }

  const toName = delegation?.to?.name
  const toNationalId = delegation?.to?.nationalId
  const fromName = userInfo?.profile.name
  const fromNationalId = userInfo?.profile.nationalId

  return (
    <Modal
      id={`access-confirm-modal-${delegation?.id}`}
      label={formatMessage(m.accessControl)}
      title={formatMessage({
        id: 'sp.settings-access-control:access-confirm-modal-title',
        defaultMessage: 'Þú ert að veita aðgang',
      })}
      {...rest}
      onClose={onClose}
      noPaddingBottom
    >
      <Box marginY={[4, 4, 8]} display="flex" flexDirection="column" rowGap={3}>
        {error && (
          <Box paddingBottom={3}>
            <AlertBanner
              description={formatMessage({
                id: 'sp.access-control-delegations:confirm-error',
                defaultMessage:
                  'Ekki tókst að vista réttindi. Vinsamlegast reyndu aftur',
              })}
              variant="error"
            />
          </Box>
        )}
        <Box
          width="full"
          display="flex"
          flexDirection={['column', 'column', 'column', 'row']}
          rowGap={[3, 3, 3, 0]}
          columnGap={[0, 0, 0, 3]}
        >
          {fromName && fromNationalId && (
            <IdentityCard
              label={formatMessage({
                id: 'sp.access-control-delegations:delegation-to',
                defaultMessage: 'Aðgangsveitandi',
              })}
              title={fromName}
              description={formatNationalId(fromNationalId)}
              color="blue"
            />
          )}
          {toName && toNationalId && (
            <IdentityCard
              label={formatMessage({
                id: 'sp.access-control-delegations:access-holder',
                defaultMessage: 'Aðgangshafi',
              })}
              title={toName}
              description={formatNationalId(toNationalId)}
              color="purple"
            />
          )}
        </Box>
        {delegation.domain && (
          <IdentityCard
            label={formatMessage({
              id: 'sp.access-control-delegations:domain',
              defaultMessage: 'Kerfi',
            })}
            title={delegation.domain.displayName}
            imgSrc={delegation.domain.organisationLogoUrl}
          />
        )}
      </Box>
      <Box display="flex" flexDirection="column" rowGap={3} marginTop={6}>
        <Box display="flex" alignItems="center" justifyContent="spaceBetween">
          <Text variant="h4" as="h4">
            {formatMessage({
              id: 'sp.access-control-delegations:access-title',
              defaultMessage: 'Réttindi',
            })}
          </Text>
        </Box>
        {scopes && (
          <Box marginBottom={[0, 0, 12]}>
            <AccessList
              validityPeriod={validityPeriod}
              scopes={scopes}
              scopeTree={scopeTree}
            />
          </Box>
        )}
      </Box>
      <Box position="sticky" bottom={0}>
        <DelegationsFormFooter
          loading={loading}
          onCancel={onClose}
          onConfirm={onConfirmHandler}
          confirmLabel={formatMessage(m.codeConfirmation)}
          confirmIcon="checkmark"
          containerPaddingBottom={[3, 3, 6]}
        />
      </Box>
    </Modal>
  )
}

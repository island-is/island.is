import { isDefined } from '@island.is/shared/utils'
import { AuthDelegationScope } from '@island.is/api/schema'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Box, useBreakpoint } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId, m as coreMessages } from '@island.is/portals/core'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { Modal, ModalProps } from '@island.is/react/components'
import { IdentityCard } from '../IdentityCard/IdentityCard'
import { AccessListContainer } from './AccessList/AccessListContainer/AccessListContainer'
import { AuthScopeTreeQuery } from './AccessList/AccessListContainer/AccessListContainer.generated'
import { AuthCustomDelegationOutgoing } from '../../types/customDelegation'
import { m } from '../../lib/messages'
import { useDynamicShadow } from '../../hooks/useDynamicShadow'

type AccessConfirmModalProps = Pick<ModalProps, 'onClose' | 'isVisible'> & {
  delegation: AuthCustomDelegationOutgoing
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
  const userInfo = useUserInfo()
  const { md } = useBreakpoint()
  const [error, setError] = useState(formError ?? false)

  const { showShadow, pxProps } = useDynamicShadow({
    rootMargin: md ? '-128px' : '-104px',
    isDisabled: !rest.isVisible,
  })

  const onConfirmHandler = async () => {
    if (!delegation.id || !scopes) {
      setError(true)
      return
    }

    await onConfirm()
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
      id="access-confirm-modal"
      label={formatMessage(m.accessConfirmModalTitle)}
      eyebrow={formatMessage(m.digitalDelegations)}
      title={formatMessage(m.accessConfirmModalTitle)}
      {...rest}
      onClose={onClose}
      noPaddingBottom
      scrollType="inside"
      closeButtonLabel={formatMessage(m.closeModal)}
    >
      <Box marginY={[4, 4, 6]} display="flex" flexDirection="column" rowGap={3}>
        {error && (
          <Problem message={formatMessage(m.confirmError)} size="small" />
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
              label={formatMessage(m.accessOwner)}
              title={fromName}
              description={formatNationalId(fromNationalId)}
              color="blue"
            />
          )}
          {toName && toNationalId && (
            <IdentityCard
              label={formatMessage(m.accessHolder)}
              title={toName}
              description={formatNationalId(toNationalId)}
              color="purple"
            />
          )}
        </Box>
        {delegation.domain && (
          <IdentityCard
            label={formatMessage(m.domain)}
            title={delegation.domain.displayName}
            imgSrc={delegation.domain.organisationLogoUrl}
          />
        )}
      </Box>
      <AccessListContainer
        delegation={delegation}
        scopes={scopes}
        scopeTree={scopeTree}
        validityPeriod={validityPeriod}
        listMarginBottom={[0, 0, 10]}
      />
      <div {...pxProps} />

      <Box position="sticky" bottom={0}>
        <DelegationsFormFooter
          loading={loading}
          showShadow={showShadow}
          onCancel={onClose}
          onConfirm={onConfirmHandler}
          confirmLabel={formatMessage(coreMessages.codeConfirmation)}
          confirmIcon="checkmark"
          containerPaddingBottom={[3, 3, 6]}
        />
      </Box>
    </Modal>
  )
}

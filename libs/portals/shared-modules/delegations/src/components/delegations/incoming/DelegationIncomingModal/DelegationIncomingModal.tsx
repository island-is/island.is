import { useEffect } from 'react'
import { useAuth } from '@island.is/auth/react'
import { Box } from '@island.is/island-ui/core'

import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/portals/core'
import { Modal, ModalProps } from '@island.is/react/components'
import { IdentityCard } from '../../../IdentityCard/IdentityCard'
import { AccessListContainer } from '../../../access/AccessList/AccessListContainer/AccessListContainer'
import { useAuthScopeTreeLazyQuery } from '../../../access/AccessList/AccessListContainer/AccessListContainer.generated'
import { AuthCustomDelegationIncoming } from '../../../../types/customDelegation'
import { m } from '../../../../lib/messages'

type DelegationIncomingModalProps = {
  delegation?: AuthCustomDelegationIncoming
} & Pick<ModalProps, 'onClose' | 'isVisible'>

export const DelegationIncomingModal = ({
  delegation,
  onClose,
  ...rest
}: DelegationIncomingModalProps) => {
  const { formatMessage, lang } = useLocale()
  const { userInfo } = useAuth()
  const [getAuthScopeTree, { data: scopeTreeData, loading: scopeTreeLoading }] =
    useAuthScopeTreeLazyQuery()

  useEffect(() => {
    if (delegation) {
      getAuthScopeTree({
        variables: {
          input: {
            domain: delegation.domain.name,
            lang,
          },
        },
      })
    }
  }, [delegation, getAuthScopeTree, lang])

  const { authScopeTree } = scopeTreeData || {}
  const fromName = delegation?.from?.name
  const fromNationalId = delegation?.from?.nationalId
  const toName = userInfo?.profile.name
  const toNationalId = userInfo?.profile.nationalId

  return (
    <Modal
      id={`delegation-incoming-view-modal-${delegation?.id}`}
      eyebrow={formatMessage(m.accessControl)}
      title={formatMessage(m.accessControlAccess)}
      label={formatMessage(m.accessControlAccess)}
      {...rest}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
    >
      <Box
        marginTop={[4, 4, 8]}
        display="flex"
        flexDirection="column"
        rowGap={3}
      >
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
        {delegation?.domain && (
          <IdentityCard
            label={formatMessage(m.domain)}
            title={delegation.domain.displayName}
            imgSrc={delegation.domain.organisationLogoUrl}
          />
        )}
      </Box>
      <AccessListContainer
        delegation={delegation}
        scopes={delegation?.scopes}
        scopeTree={authScopeTree}
        loading={scopeTreeLoading}
      />
    </Modal>
  )
}

import { AuthCustomDelegation } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import { Box } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/service-portal/core'
import { Modal, ModalProps } from '../../Modal/Modal'
import { IdentityCard } from '../../IdentityCard/IdentityCard'
import { useAuthScopeTreeLazyQuery } from '@island.is/service-portal/graphql'
import { useEffect } from 'react'
import { AccessListContainer } from '../../access/AccessList/AccessListContainer'

type DelegationIncomingModalProps = Pick<
  ModalProps,
  'onClose' | 'isVisible'
> & {
  delegation?: AuthCustomDelegation
}

export const DelegationIncomingModal = ({
  delegation,
  onClose,
  ...rest
}: DelegationIncomingModalProps) => {
  const { formatMessage, lang } = useLocale()
  const { userInfo } = useAuth()
  const [
    getAuthScopeTree,
    { data: scopeTreeData, loading: scopeTreeLoading },
  ] = useAuthScopeTreeLazyQuery()

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
      label={formatMessage(m.accessControl)}
      title={formatMessage(m.accessControlAccess)}
      {...rest}
      onClose={onClose}
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
        {delegation?.domain && (
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
      <AccessListContainer
        delegation={delegation}
        scopeTree={authScopeTree}
        loading={scopeTreeLoading}
      />
    </Modal>
  )
}

import { AuthCustomDelegation } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/service-portal/core'
import { Modal, ModalProps } from '../../Modal/Modal'
import { AccessList } from '../../access/AccessList/AccessList'
import { IdentityCard } from '../../IdentityCard/IdentityCard'
import { useAuthScopeTreeLazyQuery } from '@island.is/service-portal/graphql'
import { AccessListLoading } from '../../access/AccessList/AccessListLoading'
import { useEffect } from 'react'

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
    { data: scopeTreeData, loading },
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
      noPaddingBottom
    >
      <Box marginY={[4, 4, 8]} display="flex" flexDirection="column" rowGap={3}>
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
      <Box display="flex" flexDirection="column" rowGap={3} marginTop={6}>
        <Box display="flex" alignItems="center" justifyContent="spaceBetween">
          <Text variant="h4" as="h4">
            {formatMessage({
              id: 'sp.access-control-delegations:access-title',
              defaultMessage: 'Réttindi',
            })}
          </Text>
        </Box>
        {!loading && authScopeTree && delegation ? (
          <Box marginBottom={[0, 0, 12]}>
            <AccessList
              validityPeriod={delegation.validTo}
              scopes={delegation.scopes}
              scopeTree={authScopeTree}
            />
          </Box>
        ) : (
          <AccessListLoading rows={delegation?.scopes?.length ?? 0} />
        )}
      </Box>
    </Modal>
  )
}

import { useEffect } from 'react'
import { useAuth } from '@island.is/auth/react'
import { Box } from '@island.is/island-ui/core'

import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/portals/core'
import { Modal, ModalProps } from '@island.is/react/components'
import { IdentityCard } from '../IdentityCard/IdentityCard'
import { AccessListContainer } from '../access/AccessList/AccessListContainer/AccessListContainer'
import { useAuthScopeTreeLazyQuery } from '../access/AccessList/AccessListContainer/AccessListContainer.generated'
import {
  AuthCustomDelegation,
  AuthCustomDelegationIncoming,
  AuthCustomDelegationOutgoing,
} from '../../types/customDelegation'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { AuthDelegationType } from '@island.is/api/schema'
import isValid from 'date-fns/isValid'

type DelegationViewModalProps = {
  delegation?: AuthCustomDelegation
  direction?: 'incoming' | 'outgoing'
} & Pick<ModalProps, 'onClose' | 'isVisible'>

export const DelegationViewModal = ({
  delegation,
  direction = 'incoming',
  onClose,
  ...rest
}: DelegationViewModalProps) => {
  const { formatMessage, lang } = useLocale()
  const { userInfo } = useAuth()
  const isOutgoing = direction === 'outgoing'
  const [getAuthScopeTree, { data: scopeTreeData, loading: scopeTreeLoading }] =
    useAuthScopeTreeLazyQuery()

  useEffect(() => {
    if (delegation && delegation.domain) {
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
  const toName = isOutgoing ? delegation?.to?.name : userInfo?.profile.name
  const toNationalId = isOutgoing
    ? delegation?.to?.nationalId
    : userInfo?.profile.nationalId

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

        {delegation?.type === AuthDelegationType.GeneralMandate && (
          <>
            <Box
              display="flex"
              flexDirection={['column', 'row']}
              justifyContent="spaceBetween"
              columnGap={[0, 3]}
              rowGap={[3, 0]}
            >
              <IdentityCard
                label={formatMessage(m.domain)}
                title={formatMessage(m.delegationTypeGeneralMandate)}
                imgSrc="./assets/images/skjaldarmerki.svg"
              />
              {delegation?.createdBy && (
                <IdentityCard
                  label={formatMessage(m.createdBy)}
                  title={delegation.createdBy.name}
                />
              )}
            </Box>
            <Box
              display="flex"
              flexDirection={['column', 'row']}
              justifyContent="spaceBetween"
              columnGap={[0, 3]}
              rowGap={[3, 0]}
            >
              <IdentityCard
                label={formatMessage(m.validTo)}
                title={
                  delegation?.validTo && isValid(delegation.validTo)
                    ? format(new Date(delegation?.validTo), 'dd.MM.yyyy')
                    : formatMessage(m.noValidToDate)
                }
              />
              {delegation?.referenceId && (
                <IdentityCard
                  label={formatMessage(m.referenceId)}
                  title={delegation?.referenceId}
                />
              )}
            </Box>
          </>
        )}
      </Box>
      {delegation?.type !== AuthDelegationType.GeneralMandate && (
        <AccessListContainer
          delegation={delegation}
          scopes={delegation?.scopes}
          scopeTree={authScopeTree}
          loading={scopeTreeLoading}
        />
      )}
    </Modal>
  )
}

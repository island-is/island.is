import { useEffect, useState } from 'react'

import { Box, toast, useBreakpoint } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/portals/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { Modal, ModalProps } from '@island.is/react/components'
import { AuthDelegationType } from '@island.is/shared/types'

import { useDynamicShadow } from '../../../hooks/useDynamicShadow'
import { m } from '../../../lib/messages'
import {
  AuthCustomDelegation,
  AuthCustomDelegationOutgoing,
} from '../../../types/customDelegation'
import { IdentityCard } from '../../IdentityCard/IdentityCard'
import { DelegationsFormFooter } from '../../delegations/DelegationsFormFooter'
import { AccessListContainer } from '../AccessList/AccessListContainer/AccessListContainer'
import { useAuthScopeTreeLazyQuery } from '../AccessList/AccessListContainer/AccessListContainer.generated'
import { useDeleteAuthDelegationMutation } from './AccessDeleteModal.generated'

type AccessDeleteModalProps = Pick<ModalProps, 'onClose' | 'isVisible'> & {
  delegation?: AuthCustomDelegation
  onDelete(): void
}

export const AccessDeleteModal = ({
  delegation,
  onClose,
  onDelete,
  ...rest
}: AccessDeleteModalProps) => {
  const { formatMessage, lang } = useLocale()
  const userInfo = useUserInfo()
  const { md } = useBreakpoint()
  const [error, setError] = useState(false)
  const [deleteAuthDelegation, { loading }] = useDeleteAuthDelegationMutation()
  const [getAuthScopeTree, { data: scopeTreeData, loading: scopeTreeLoading }] =
    useAuthScopeTreeLazyQuery()

  useEffect(() => {
    if (delegation && delegation.domain?.name) {
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

  const onDeleteHandler = async () => {
    if (!delegation?.id) return

    try {
      const { errors } = await deleteAuthDelegation({
        variables: {
          input: {
            delegationId: delegation.id,
          },
        },
      })

      if (errors) {
        setError(true)
        return
      }

      onDelete()

      toast.success(formatMessage(m.deleteSuccess))
    } catch (error) {
      setError(true)
    }
  }

  const toName = (delegation as AuthCustomDelegationOutgoing)?.to?.name
  const toNationalId = (delegation as AuthCustomDelegationOutgoing)?.to
    ?.nationalId
  const fromName = userInfo?.profile.name
  const fromNationalId = userInfo?.profile.nationalId

  const { showShadow, pxProps } = useDynamicShadow({
    rootMargin: md ? '-128px' : '-104px',
    isDisabled: !rest.isVisible,
  })

  return (
    <Modal
      id="access-delete-modal"
      eyebrow={formatMessage(m.digitalDelegations)}
      title={formatMessage(m.accessRemoveModalTitle)}
      label={formatMessage(m.accessRemoveModalTitle)}
      onClose={onClose}
      noPaddingBottom
      scrollType="inside"
      closeButtonLabel={formatMessage(m.closeModal)}
      {...rest}
    >
      <Box
        marginTop={[4, 4, 8]}
        display="flex"
        flexDirection="column"
        rowGap={3}
      >
        {error && (
          <Problem message={formatMessage(m.deleteError)} size="small" />
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
        {delegation?.type === AuthDelegationType.GeneralMandate ? (
          <IdentityCard
            label={formatMessage(m.domain)}
            title={formatMessage(m.delegationTypeGeneralMandate)}
            imgSrc="./assets/images/skjaldarmerki.svg"
          />
        ) : (
          <>
            {delegation?.domain && (
              <IdentityCard
                label={formatMessage(m.domain)}
                title={delegation?.domain.displayName ?? ''}
                imgSrc={delegation?.domain.organisationLogoUrl}
              />
            )}
            <AccessListContainer
              delegation={delegation}
              scopes={delegation?.scopes}
              scopeTree={authScopeTree}
              loading={scopeTreeLoading}
              listMarginBottom={[0, 0, 10]}
            />
          </>
        )}
        <div {...pxProps} />
      </Box>
      <Box position="sticky" bottom={0}>
        <DelegationsFormFooter
          loading={loading}
          showShadow={showShadow}
          confirmButtonColorScheme="destructive"
          onCancel={onClose}
          onConfirm={onDeleteHandler}
          containerPaddingBottom={[3, 3, 4]}
          confirmLabel={formatMessage(m.deleteAccess)}
        />
      </Box>
    </Modal>
  )
}

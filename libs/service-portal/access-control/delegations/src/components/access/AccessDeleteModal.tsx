import { AuthCustomDelegation } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import {
  AlertMessage,
  Box,
  SkeletonLoader,
  toast,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/service-portal/core'
import {
  useAuthScopeTreeQuery,
  useDeleteAuthDelegationMutation,
} from '@island.is/service-portal/graphql'
import { useState } from 'react'
import { DelegationsFormFooter } from '../delegations/DelegationsFormFooter'
import { Modal, ModalProps } from '../Modal/Modal'
import { m } from '@island.is/service-portal/core'
import { IdentityCard } from '../IdentityCard/IdentityCard'
import { AccessList } from '../access/AccessList/AccessList'
import { ROW_LOADING_HEIGHT } from './access.utils'

type AccessDeleteModalProps = Pick<ModalProps, 'onClose' | 'isVisible'> & {
  delegation: AuthCustomDelegation
  onDelete(): void
}

export const AccessDeleteModal = ({
  delegation,
  onClose,
  onDelete,
  ...rest
}: AccessDeleteModalProps) => {
  const { formatMessage, lang } = useLocale()
  const { userInfo } = useAuth()
  const [error, setError] = useState(false)
  const [deleteAuthDelegation, { loading }] = useDeleteAuthDelegationMutation()

  const {
    data: scopeTreeData,
    loading: scopeTreeLoading,
  } = useAuthScopeTreeQuery({
    variables: {
      input: {
        domain: delegation?.domain.name,
        lang,
      },
    },
  })

  const { authScopeTree } = scopeTreeData || {}

  const onDeleteHandler = async () => {
    if (!delegation.id) return

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

      toast.success(
        formatMessage({
          id: 'sp.access-control-delegations:delete-success',
          defaultMessage: 'Aðgangi eytt',
        }),
      )
    } catch (error) {
      setError(true)
    }
  }

  const toName = delegation?.to?.name
  const toNationalId = delegation?.to?.nationalId
  const fromName = userInfo?.profile.name
  const fromNationalId = userInfo?.profile.nationalId

  return (
    <Modal
      id={`access-delete-modal-${delegation?.id}`}
      label={formatMessage(m.accessControl)}
      title={formatMessage({
        id: 'sp.settings-access-control:access-remove-modal-content',
        defaultMessage: 'Ertu viss um að þú viljir eyða þessum aðgangi?',
      })}
      onClose={onClose}
      noPaddingBottom
      {...rest}
    >
      <Box
        marginTop={[4, 4, 8]}
        display="flex"
        flexDirection="column"
        rowGap={3}
      >
        {error && (
          <Box paddingBottom={3}>
            <AlertMessage
              message={formatMessage({
                id: 'sp.access-control-delegations:delete-error',
                defaultMessage:
                  'Ekki tókst að eyða umboði. Vinsamlegast reyndu aftur',
              })}
              type="error"
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
        <Box display="flex" flexDirection="column" rowGap={3} marginTop={6}>
          <Box display="flex" alignItems="center" justifyContent="spaceBetween">
            <Text variant="h4" as="h4">
              {formatMessage({
                id: 'sp.access-control-delegations:access-title',
                defaultMessage: 'Réttindi',
              })}
            </Text>
          </Box>
          {!scopeTreeLoading && authScopeTree ? (
            <Box marginBottom={[1, 1, 12]}>
              <AccessList
                validityPeriod={delegation.validTo}
                scopes={delegation.scopes}
                scopeTree={authScopeTree}
              />
            </Box>
          ) : (
            <SkeletonLoader
              height={
                // HEADER + ROWS
                ROW_LOADING_HEIGHT +
                (ROW_LOADING_HEIGHT * delegation?.scopes?.length ?? 0)
              }
            />
          )}
        </Box>
      </Box>
      <Box position="sticky" bottom={0}>
        <DelegationsFormFooter
          loading={loading}
          showDivider={false}
          confirmButtonColorScheme="destructive"
          onCancel={onClose}
          onConfirm={onDeleteHandler}
          containerPaddingBottom={[3, 3, 6]}
          confirmLabel={formatMessage({
            id: 'sp.access-control-delegations:delete-access',
            defaultMessage: 'Eyða aðgangi',
          })}
        />
      </Box>
    </Modal>
  )
}

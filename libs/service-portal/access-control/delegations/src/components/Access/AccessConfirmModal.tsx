import { AuthCustomDelegation } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import { AlertBanner, Box } from '@island.is/island-ui/core'
import { useNamespaces, useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/service-portal/core'
import { useUpdateAuthDelegationMutation } from '@island.is/service-portal/graphql'
import { useState } from 'react'
import { DelegationsFormFooter } from '../DelegationsFormFooter'
import { IdentityCard } from '../IdentityCard'
import { Modal, ModalProps } from '../Modal'

type AccessConfirmModalProps = ModalProps & {
  delegation: AuthCustomDelegation
  domain: {
    name: string | undefined
    imgSrc: string | undefined
  }
  onConfirm(): void
  children: React.ReactNode
}

export const AccessConfirmModal = ({
  delegation,
  domain,
  onClose,
  onConfirm,
  children,
  ...rest
}: AccessConfirmModalProps) => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const [error, setError] = useState(false)
  const [updateAuthDelegationn, { loading }] = useUpdateAuthDelegationMutation()

  const onConfirmHandler = async () => {
    if (!delegation.id) return

    try {
      const { errors } = await updateAuthDelegationn({
        variables: {
          input: {
            delegationId: delegation.id,
            scopes: [],
          },
        },
      })

      if (errors) {
        setError(true)
        return
      }

      onConfirm()
    } catch (error) {
      setError(true)
    }
  }

  const toName = delegation?.to?.name
  const toNationalId = delegation?.to?.nationalId
  const fromName = userInfo?.profile.name
  const fromNationalId = userInfo?.profile.nationalId

  return (
    <Modal {...rest} onClose={onClose}>
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
                id: 'sp.access-control-delegations.delegation-to',
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
                id: 'sp.access-control-delegations:signed-in-user',
                defaultMessage: 'Aðgangshafi',
              })}
              title={toName}
              description={formatNationalId(toNationalId)}
              color="purple"
            />
          )}
        </Box>
        {domain?.name && domain?.imgSrc && (
          <IdentityCard
            label={formatMessage({
              id: 'sp.access-control-delegations:domain',
              defaultMessage: 'Kerfi',
            })}
            title={domain.name}
            imgSrc={domain.imgSrc}
          />
        )}
      </Box>
      {children}
      <DelegationsFormFooter
        loading={loading}
        showDivider={false}
        onCancel={onClose}
        onConfirm={onConfirmHandler}
        confirmLabel={formatMessage({
          id: 'sp.settings-access-control:empty-new-access',
          defaultMessage: 'Veita aðgang',
        })}
        confirmIcon="checkmark"
      />
    </Modal>
  )
}

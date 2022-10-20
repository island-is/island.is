import { AuthCustomDelegation } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import { AlertMessage, Box, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId } from '@island.is/service-portal/core'
import { useDeleteAuthDelegationMutation } from '@island.is/service-portal/graphql'
import { useState } from 'react'
import { DelegationsFormFooter } from '../DelegationsFormFooter'
import { IdentityCard } from '../IdentityCard'
import { Modal } from '../Modal'
import type { ModalProps } from '../Modal/Modal'

type AccessDeleteModalProps = ModalProps & {
  delegation: AuthCustomDelegation
  domain: {
    name: string | undefined
    imgSrc: string | undefined
  }
  onDelete(): void
}

export const AccessDeleteModal = ({
  delegation,
  domain,
  onClose,
  onDelete,
  ...rest
}: AccessDeleteModalProps) => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const [error, setError] = useState(false)
  const [deleteAuthDelegation, { loading }] = useDeleteAuthDelegationMutation()

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
    <Modal {...rest} onClose={onClose}>
      <Box
        marginTop={[2, 2, 8]}
        marginBottom={[2, 2, 5]}
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
        <AlertMessage
          message={formatMessage({
            id: 'sp.access-control-delegations:delete-warning',
            defaultMessage:
              '[Ath. að öll réttindi aðgangshafa í þessu kerfi detta út/öll réttindi sem fylgja þessu umboði detta út.]',
          })}
          type="warning"
        />
      </Box>
      <DelegationsFormFooter
        loading={loading}
        showDivider={false}
        confirmButtonColorScheme="destructive"
        onCancel={onClose}
        onConfirm={onDeleteHandler}
        confirmLabel={formatMessage({
          id: 'sp.access-control-delegations:delete-access',
          defaultMessage: 'Eyða aðgangi',
        })}
      />
    </Modal>
  )
}

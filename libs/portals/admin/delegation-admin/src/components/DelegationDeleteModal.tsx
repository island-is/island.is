import { Box, useBreakpoint } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatNationalId, m as coreMessages } from '@island.is/portals/core'
import { Modal, ModalProps } from '@island.is/react/components'
import { m } from '../lib/messages'
import {
  DelegationsFormFooter,
  IdentityCard,
  useDynamicShadow,
} from '@island.is/portals/shared-modules/delegations'
import { AuthCustomDelegation } from '@island.is/api/schema'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import { AuthDelegationType } from '@island.is/shared/types'

type DelegationDeleteModalProps = Pick<
  ModalProps,
  'id' | 'onClose' | 'isVisible'
> & {
  loading: boolean
  delegation?: AuthCustomDelegation
  onDelete(): void
}

export const DelegationDeleteModal = ({
  id,
  loading,
  delegation,
  onClose,
  onDelete,
  ...rest
}: DelegationDeleteModalProps) => {
  const { formatMessage } = useLocale()
  const { md } = useBreakpoint()

  const { showShadow, pxProps } = useDynamicShadow({
    rootMargin: md ? '-128px' : '-104px',
    isDisabled: !rest.isVisible,
  })

  return (
    <Modal
      id={id}
      label={formatMessage(m.deleteDelegationModalTitle)}
      title={formatMessage(m.deleteDelegationModalTitle)}
      onClose={onClose}
      noPaddingBottom
      scrollType="inside"
      closeButtonLabel={formatMessage(m.cancel)}
      {...rest}
    >
      <Box marginY={4} display="flex" flexDirection="column" rowGap={3}>
        <Box
          width="full"
          display="flex"
          flexDirection={['column', 'column', 'column', 'row']}
          rowGap={[3, 3, 3, 0]}
          columnGap={[0, 0, 0, 3]}
        >
          {delegation?.from?.name && delegation?.from?.nationalId && (
            <IdentityCard
              label={formatMessage(m.fromNationalId)}
              title={delegation?.from?.name}
              description={formatNationalId(delegation?.from?.nationalId)}
              color="blue"
            />
          )}
          {delegation?.to?.name && delegation?.to?.nationalId && (
            <IdentityCard
              label={formatMessage(m.toNationalId)}
              title={delegation?.to.name}
              description={formatNationalId(delegation?.to.nationalId)}
              color="purple"
            />
          )}
        </Box>
        {delegation?.type &&
          delegation.type === AuthDelegationType.GeneralMandate && (
            <IdentityCard
              label={formatMessage(m.type)}
              title={formatMessage(m.generalMandateLabel)}
              imgSrc="./assets/images/skjaldarmerki.svg"
            />
          )}

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
                : formatMessage(m.noEndDate)
            }
          />
          {delegation?.referenceId && (
            <IdentityCard
              label={formatMessage(m.referenceId)}
              title={delegation?.referenceId}
            />
          )}
        </Box>
      </Box>

      <div {...pxProps} />

      <Box position="sticky" bottom={0}>
        <DelegationsFormFooter
          loading={loading}
          showShadow={showShadow}
          confirmButtonColorScheme="destructive"
          onCancel={onClose}
          onConfirm={onDelete}
          confirmLabel={formatMessage(coreMessages.buttonDestroy)}
          containerPaddingBottom={[3, 3, 6]}
        />
      </Box>
    </Modal>
  )
}

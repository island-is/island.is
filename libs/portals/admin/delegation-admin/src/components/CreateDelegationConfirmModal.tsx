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
import { Identity } from '@island.is/api/schema'
import format from 'date-fns/format'

type CreateDelegationConfirmModalProps = Pick<
  ModalProps,
  'onClose' | 'isVisible'
> & {
  fromIdentity: Identity | null
  toIdentity: Identity | null
  data: {
    fromNationalId: string
    type: string
    toNationalId: string
    referenceId: string
    validTo?: string | undefined
  } | null
  loading: boolean
  onConfirm(): void
}

export const CreateDelegationConfirmModal = ({
  fromIdentity,
  toIdentity,
  data,
  loading,
  onClose,
  onConfirm,
  ...rest
}: CreateDelegationConfirmModalProps) => {
  const { formatMessage } = useLocale()
  const { md } = useBreakpoint()

  const { showShadow, pxProps } = useDynamicShadow({
    rootMargin: md ? '-128px' : '-104px',
    isDisabled: !rest.isVisible,
  })

  return (
    <Modal
      id="access-confirm-modal"
      label={formatMessage(m.createDelegationConfirmModalTitle)}
      title={formatMessage(m.createDelegationConfirmModalTitle)}
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
          {fromIdentity?.name && fromIdentity?.nationalId && (
            <IdentityCard
              label={formatMessage(m.fromNationalId)}
              title={fromIdentity.name}
              description={formatNationalId(fromIdentity.nationalId)}
              color="blue"
            />
          )}
          {toIdentity?.name && toIdentity?.nationalId && (
            <IdentityCard
              label={formatMessage(m.toNationalId)}
              title={toIdentity.name}
              description={formatNationalId(toIdentity.nationalId)}
              color="purple"
            />
          )}
        </Box>
        {data?.type && (
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
              data?.validTo
                ? format(new Date(data?.validTo), 'dd.MM.yyyy')
                : formatMessage(m.noEndDate)
            }
          />
          {data?.referenceId && (
            <IdentityCard
              label={formatMessage(m.referenceId)}
              title={data?.referenceId}
            />
          )}
        </Box>
      </Box>

      <div {...pxProps} />

      <Box position="sticky" bottom={0}>
        <DelegationsFormFooter
          showShadow={showShadow}
          loading={loading}
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={formatMessage(coreMessages.codeConfirmation)}
          confirmIcon="checkmark"
          containerPaddingBottom={[3, 3, 6]}
        />
      </Box>
    </Modal>
  )
}

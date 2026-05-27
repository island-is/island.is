import React from 'react'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'

import { m } from '../../../lib/messages'

interface PermissionDescriptionChangeConfirmModalProps {
  onConfirm: () => void
  onClose: () => void
}

export const PermissionDescriptionChangeConfirmModal = ({
  onConfirm,
  onClose,
}: PermissionDescriptionChangeConfirmModalProps) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id="permission-description-change-confirm"
      isVisible
      label={formatMessage(m.descriptionChangeWarningTitle)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.cancel)}
      scrollType="outside"
    >
      <Box paddingX={4}>
        <Text variant="h2" as="h2" marginBottom={2}>
          {formatMessage(m.descriptionChangeWarningTitle)}
        </Text>
        <Text marginBottom={3}>
          {formatMessage(m.descriptionChangeWarningMessage)}
        </Text>
        <Box
          paddingTop={2}
          paddingBottom={4}
          display="flex"
          justifyContent="spaceBetween"
          columnGap={2}
        >
          <Button variant="ghost" onClick={onClose}>
            {formatMessage(m.cancel)}
          </Button>
          <Button onClick={onConfirm}>{formatMessage(m.save)}</Button>
        </Box>
      </Box>
    </Modal>
  )
}

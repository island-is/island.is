import { Box, Button, Text } from '@island.is/island-ui/core'
import { Modal } from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'
import { Markdown } from '@island.is/shared/components'
import { useLocale } from '@island.is/localization'

interface InfoModalProps {
  open: boolean
  onClose: () => void
}

export const InfoModal: React.FC<InfoModalProps> = ({ open, onClose }) => {
  const { formatMessage } = useLocale()
  return (
    <Modal
      id={'patient-data-permit-info-modal'}
      initialVisibility={open}
      isVisible={open}
      title={formatMessage(messages.keyHealthInformation)}
      onCloseModal={onClose}
      text={formatMessage(messages.keyHealthInformationDescription)}
    >
      <Text marginTop={2}>
        <Markdown>{formatMessage(messages.keyHealthInformationList)}</Markdown>
      </Text>
    </Modal>
  )
}

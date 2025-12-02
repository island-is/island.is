import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/portals/my-pages/core'
import { Markdown } from '@island.is/shared/components'
import React from 'react'
import { messages } from '../../lib/messages'

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

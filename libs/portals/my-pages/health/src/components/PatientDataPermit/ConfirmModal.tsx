import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'

interface ConfirmModalProps {
  title: string
  description?: string
  open: boolean
  onClose: () => void
  onSubmit: () => void
  loading?: boolean
  content?: React.ReactNode
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  onClose,
  onSubmit,
  content,
  loading = false,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id={'confirm-permit-modal'}
      initialVisibility={open}
      isVisible={open}
      title={title ?? formatMessage(messages.addNewPermitTitle)}
      text={description}
      onCloseModal={onClose}
      buttons={[
        {
          id: 'confirm-permit-cancel-button',
          loading: false,
          onClick: () => onClose(),
          text: formatMessage(messages.cancel),
          type: 'ghost',
        },
        {
          id: 'confirm-permit-confirm-button',
          loading: loading,
          onClick: () => {
            onSubmit()
          },
          text: formatMessage(messages.confirm),
          type: 'primary',
        },
      ]}
      buttonsSpacing="spaceBetween"
    >
      {content}
    </Modal>
  )
}

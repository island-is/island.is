import { useLocale } from '@island.is/localization'
import { m as coreMessages, Modal } from '@island.is/portals/my-pages/core'

export const ConfirmRevokeModal = ({
  id,
  title,
  text,
  confirmLabel,
  loading,
  onConfirm,
  onClose,
}: {
  id: string
  title: string
  text: string
  confirmLabel: string
  loading: boolean
  onConfirm: () => void
  onClose: () => void
}) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id={id}
      label={title}
      title={title}
      text={text}
      onCloseModal={onClose}
      buttonsSpacing="spaceBetween"
      buttons={[
        {
          id: `${id}-cancel`,
          type: 'ghost',
          text: formatMessage(coreMessages.buttonCancel),
          onClick: onClose,
        },
        {
          id: `${id}-confirm`,
          type: 'primary',
          text: confirmLabel,
          loading,
          onClick: onConfirm,
        },
      ]}
    />
  )
}

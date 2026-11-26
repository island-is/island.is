import { useLocale } from '@island.is/localization'
import {
  ActionCard,
  m as coreMessages,
  Modal,
} from '@island.is/portals/my-pages/core'

export const ConfirmRevokeModal = ({
  id,
  title,
  text,
  summary,
  confirmLabel,
  loading,
  onConfirm,
  onClose,
}: {
  id: string
  title: string
  text: string
  summary: { heading: string; text: string; subText: string }
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
          colorScheme: 'destructive',
          text: confirmLabel,
          loading,
          onClick: onConfirm,
        },
      ]}
    >
      <ActionCard
        heading={summary.heading}
        text={summary.text}
        subText={summary.subText}
        cta={{ label: '', hide: true }}
      />
    </Modal>
  )
}

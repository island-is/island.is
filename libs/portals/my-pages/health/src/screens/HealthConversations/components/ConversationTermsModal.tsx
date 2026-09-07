import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/portals/my-pages/core'
import { Markdown } from '@island.is/shared/components'
import { messages } from '../../../lib/messages'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ConversationTermsModal = ({ isOpen, onClose }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id="conversation-terms-modal"
      isVisible={isOpen}
      initialVisibility={false}
      onCloseModal={onClose}
      title={formatMessage(messages.healthConversationsTermsModalTitle)}
    >
      <Markdown>
        {formatMessage(messages.healthConversationsTermsModalBody)}
      </Markdown>
    </Modal>
  )
}

export default ConversationTermsModal

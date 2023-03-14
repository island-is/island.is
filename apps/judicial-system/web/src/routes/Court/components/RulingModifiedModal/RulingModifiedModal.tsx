import { useIntl } from 'react-intl'

import { Modal } from '@island.is/judicial-system-web/src/components'

import { strings } from './RulingModifiedModal.strings'

interface Props {
  onCancel: () => void
  onContinue: () => void
}

const RulingModifiedModal: React.FC<Props> = ({ onCancel, onContinue }) => {
  const { formatMessage } = useIntl()

  return (
    <Modal
      title={formatMessage(strings.title)}
      text={formatMessage(strings.text)}
      primaryButtonText={formatMessage(strings.continue)}
      onPrimaryButtonClick={onContinue}
      secondaryButtonText={formatMessage(strings.cancel)}
      onSecondaryButtonClick={onCancel}
    />
  )
}

export default RulingModifiedModal

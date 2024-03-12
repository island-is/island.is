import { useIntl } from 'react-intl'

import RulingModifiedModal from './RulingModifiedModal'
import { strings } from './JudgeRulingModifiedModal.strings'

interface Props {
  onCancel: () => void
  onContinue: () => void
  continueDisabled?: boolean
}

const JudgeRulingModifiedModal: React.FC<React.PropsWithChildren<Props>> = ({
  onCancel,
  onContinue,
  continueDisabled,
}) => {
  const { formatMessage } = useIntl()

  return (
    <RulingModifiedModal
      onCancel={onCancel}
      onContinue={onContinue}
      continueDisabled={continueDisabled}
      description={formatMessage(strings.description)}
    />
  )
}

export default JudgeRulingModifiedModal

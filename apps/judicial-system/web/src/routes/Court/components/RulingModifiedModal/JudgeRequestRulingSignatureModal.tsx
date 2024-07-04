import { FC } from 'react'
import { useIntl } from 'react-intl'

import RequestRulingSignatureModal from './RequestRulingSignatureModal'
import { strings } from './JudgeRequestRulingSignatureModal.strings'

interface Props {
  onYes: () => void
  onNo: () => void
}

const JudgeRequestRulingSignatureModal: FC<Props> = ({ onYes, onNo }) => {
  const { formatMessage } = useIntl()

  return (
    <RequestRulingSignatureModal
      onYes={onYes}
      onNo={onNo}
      description={formatMessage(strings.description)}
    />
  )
}

export default JudgeRequestRulingSignatureModal

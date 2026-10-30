import type { FC } from 'react'

import RequestRulingSignatureModal from './RequestRulingSignatureModal'
import { strings } from './JudgeRequestRulingSignatureModal.strings'

interface Props {
  onYes: () => void
  onNo: () => void
}

const JudgeRequestRulingSignatureModal: FC<Props> = ({ onYes, onNo }) => {
  return (
    <RequestRulingSignatureModal
      onYes={onYes}
      onNo={onNo}
      description={strings.description}
    />
  )
}

export default JudgeRequestRulingSignatureModal

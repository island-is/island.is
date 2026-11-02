import type { FC } from 'react'

import RequestRulingSignatureModal from './RequestRulingSignatureModal'
import { strings } from './RegistrarRequestRulingSignatureModal.strings'

interface Props {
  onContinue: () => void
}

const RegistrarRequestRulingSignatureModal: FC<Props> = ({ onContinue }) => {
  return (
    <RequestRulingSignatureModal
      onYes={onContinue}
      onNo={onContinue}
      description={strings.description}
    />
  )
}

export default RegistrarRequestRulingSignatureModal

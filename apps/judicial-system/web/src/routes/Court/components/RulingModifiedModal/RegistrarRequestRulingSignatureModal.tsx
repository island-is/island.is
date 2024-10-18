import { FC } from 'react'
import { useIntl } from 'react-intl'

import RequestRulingSignatureModal from './RequestRulingSignatureModal'
import { strings } from './RegistrarRequestRulingSignatureModal.strings'

interface Props {
  onContinue: () => void
}

const RegistrarRequestRulingSignatureModal: FC<Props> = ({ onContinue }) => {
  const { formatMessage } = useIntl()

  return (
    <RequestRulingSignatureModal
      onYes={onContinue}
      onNo={onContinue}
      description={formatMessage(strings.description)}
    />
  )
}

export default RegistrarRequestRulingSignatureModal

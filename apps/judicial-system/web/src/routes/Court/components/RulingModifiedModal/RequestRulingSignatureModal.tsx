import { useIntl } from 'react-intl'

import { Modal } from '@island.is/judicial-system-web/src/components'

import { strings } from './RequestRulingSignatureModal.strings'

interface Props {
  onYes: () => void
  onNo: () => void
}

const RequestRulingSignatureModal: React.FC<React.PropsWithChildren<Props>> = ({
  onYes,
  onNo,
}) => {
  const { formatMessage } = useIntl()

  return (
    <Modal
      title={formatMessage(strings.title)}
      text={formatMessage(strings.description)}
      onPrimaryButtonClick={onYes}
      primaryButtonText={formatMessage(strings.yes)}
      onSecondaryButtonClick={onNo}
      secondaryButtonText={formatMessage(strings.no)}
    />
  )
}

export default RequestRulingSignatureModal

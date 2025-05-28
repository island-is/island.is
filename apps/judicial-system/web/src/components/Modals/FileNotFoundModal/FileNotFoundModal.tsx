import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Modal } from '@island.is/judicial-system-web/src/components'

import { strings } from './FileNotFoundModal.strings'

interface Props {
  dismiss: () => void
}

const FileNotFoundModal: FC<Props> = ({ dismiss }) => {
  const { formatMessage } = useIntl()

  return (
    <Modal
      title={formatMessage(strings.title)}
      text={formatMessage(strings.text)}
      onClose={dismiss}
      onPrimaryButtonClick={dismiss}
      primaryButtonText={formatMessage(strings.close)}
    />
  )
}

export default FileNotFoundModal

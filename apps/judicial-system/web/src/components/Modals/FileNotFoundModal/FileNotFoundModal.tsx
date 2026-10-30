import type { FC } from 'react'

import { Modal } from '@island.is/judicial-system-web/src/components'

import { strings } from './FileNotFoundModal.strings'

interface Props {
  dismiss: () => void
}

const FileNotFoundModal: FC<Props> = ({ dismiss }) => {
  return (
    <Modal
      title={strings.title}
      text={strings.text}
      onClose={dismiss}
      buttons={[
        {
          text: strings.close,
          onClick: dismiss,
        },
      ]}
    />
  )
}

export default FileNotFoundModal

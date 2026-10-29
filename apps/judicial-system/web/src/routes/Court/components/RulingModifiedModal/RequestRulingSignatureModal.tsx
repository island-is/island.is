import type { FC } from 'react'
import { useContext } from 'react'

import {
  FormContext,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './RequestRulingSignatureModal.strings'

interface Props {
  onYes: () => void
  onNo: () => void
  description: string
}

const RequestRulingSignatureModal: FC<Props> = ({
  onYes,
  onNo,
  description,
}) => {
  const { workingCase } = useContext(FormContext)
  const { updateCase } = useCase()

  const handleContinue = async () => {
    const caseUpdate = await updateCase(workingCase.id, {
      rulingSignatureDate: null,
    })

    if (caseUpdate) {
      onYes()
    }
  }

  return (
    <Modal
      title={strings.title}
      text={description}
      buttons={[
        {
          text: strings.no,
          onClick: onNo,
          variant: 'ghost',
        },
        {
          text: strings.yes,
          onClick: handleContinue,
        },
      ]}
    />
  )
}

export default RequestRulingSignatureModal

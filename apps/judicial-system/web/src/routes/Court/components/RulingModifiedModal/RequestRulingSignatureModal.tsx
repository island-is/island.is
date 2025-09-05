import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

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
  const { formatMessage } = useIntl()
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
      title={formatMessage(strings.title)}
      text={description}
      primaryButton={{
        text: formatMessage(strings.yes),
        onClick: handleContinue,
      }}
      secondaryButton={{
        text: formatMessage(strings.no),
        onClick: onNo,
      }}
    />
  )
}

export default RequestRulingSignatureModal

import { FC } from 'react'
import { useIntl } from 'react-intl'

import { RulingModifiedModal as BaseModal } from '@island.is/judicial-system-web/src/components'
import { useTargetAppealCaseByAppealCaseId } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './RulingModifiedModal.strings'

interface Props {
  onCancel: () => void
  onContinue: () => void
  continueDisabled?: boolean
}

const RulingModifiedModal: FC<Props> = ({
  onCancel,
  onContinue,
  continueDisabled,
}) => {
  const { formatMessage } = useIntl()
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()

  return (
    <BaseModal
      onCancel={onCancel}
      onContinue={onContinue}
      continueDisabled={continueDisabled}
      description={formatMessage(strings.description)}
      defaultExplanation={formatMessage(strings.autofill)}
      fieldToModify="appealRulingModifiedHistory"
      appealCaseId={targetAppealCase?.id}
    />
  )
}

export default RulingModifiedModal

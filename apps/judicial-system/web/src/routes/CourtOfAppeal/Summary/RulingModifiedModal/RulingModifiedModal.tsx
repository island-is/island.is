import type { FC } from 'react'

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
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()

  return (
    <BaseModal
      onCancel={onCancel}
      onContinue={onContinue}
      continueDisabled={continueDisabled}
      description={strings.description}
      defaultExplanation={strings.autofill}
      fieldToModify="appealRulingModifiedHistory"
      appealCaseId={targetAppealCase?.id}
    />
  )
}

export default RulingModifiedModal

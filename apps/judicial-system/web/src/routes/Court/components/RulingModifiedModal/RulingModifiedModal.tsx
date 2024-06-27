import { FC } from 'react'
import { useIntl } from 'react-intl'

import { RulingModifiedModal as BaseModal } from '@island.is/judicial-system-web/src/components'

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
  return (
    <BaseModal
      onCancel={onCancel}
      onContinue={onContinue}
      continueDisabled={continueDisabled}
      description={formatMessage(strings.description)}
      defaultExplanation={formatMessage(strings.autofill)}
      fieldToModify="rulingModifiedHistory"
    />
  )
}

export default RulingModifiedModal

import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/parentalLeaveUtils'
import { ReviewGroupProps } from './props'
import { YES } from '@island.is/application/core'

export const SpousePersonalAllowance = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    usePersonalAllowanceFromSpouse,
    spouseUseAsMuchAsPossible,
    spouseUsage,
  } = getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('personalAllowanceFromSpouse')}
    >
      {usePersonalAllowanceFromSpouse === YES ? (
        <DataValue
          label={formatMessage(
            parentalLeaveFormMessages.personalAllowance.spouseTitle,
          )}
          value={`${spouseUseAsMuchAsPossible === YES ? 100 : spouseUsage}%`}
        />
      ) : (
        <RadioValue
          label={formatMessage(
            parentalLeaveFormMessages.personalAllowance.spouseTitle,
          )}
          value={usePersonalAllowanceFromSpouse ?? ''}
        />
      )}
    </ReviewGroup>
  )
}

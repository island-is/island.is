import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { YES } from '../../../constants'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/parentalLeaveUtils'
import { ReviewGroupProps } from './props'

export const PersonalAllowance = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { usePersonalAllowance, personalUseAsMuchAsPossible, personalUsage } =
    getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('personalAllowance')}
    >
      {usePersonalAllowance === YES ? (
        <DataValue
          label={formatMessage(
            parentalLeaveFormMessages.personalAllowance.title,
          )}
          value={`${
            personalUseAsMuchAsPossible === YES ? 100 : personalUsage
          }%`}
        />
      ) : (
        <RadioValue
          label={formatMessage(
            parentalLeaveFormMessages.personalAllowance.title,
          )}
          value={usePersonalAllowance}
        />
      )}
    </ReviewGroup>
  )
}

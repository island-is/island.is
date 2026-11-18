import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { getRightsIntro } from '../../lib/parentalLeaveUtils'

/**
 * The applicant's rights as a read-only input. Not a text field: that would
 * save the text as an answer and keep it after the requested days change.
 */
const RightsIntro: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { months, requestedDays } = getRightsIntro(application)

  return (
    <Input
      id="rightsIntro.rights"
      name="rightsIntro.rights"
      label={formatMessage(parentalLeaveFormMessages.shared.yourRights)}
      value={
        requestedDays > 0
          ? formatMessage(
              parentalLeaveFormMessages.shared
                .yourRightsInMonthsAndRequestedDays,
              { months, days: requestedDays },
            )
          : formatMessage(parentalLeaveFormMessages.shared.yourRightsInMonths, {
              months,
            })
      }
      readOnly
    />
  )
}

export default RightsIntro

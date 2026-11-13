import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { Box, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { daysInMonth, defaultMonths } from '../../config'
import { getMaxMultipleBirthsAndDefaultMonths } from '../../lib/parentalLeaveUtils'

export type RightsTotalKind = 'request' | 'give' | 'multipleBirths'

const daysAnswerId: Record<RightsTotalKind, string> = {
  request: 'requestRights.requestDays',
  give: 'giveRights.giveDays',
  multipleBirths: 'multipleBirthsRequestDays',
}

/**
 * Total time on leave next to the days input on the same screen, updated as
 * the applicant types. A display field cannot do this: its value is a plain
 * string, so the months and days could not be translated.
 */
const RightsTotal: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const { watch } = useFormContext()
  const kind = ((field as CustomField).props?.kind ??
    'request') as RightsTotalKind
  const days = Number(watch(daysAnswerId[kind]) || 0)

  const totalDays =
    kind === 'give'
      ? defaultMonths * daysInMonth - days
      : kind === 'request'
      ? getMaxMultipleBirthsAndDefaultMonths(application.answers) *
          daysInMonth +
        days
      : defaultMonths * daysInMonth + days
  const months = Math.floor(totalDays / daysInMonth)
  const remainingDays = totalDays % daysInMonth

  // Same top spacing as the text field it sits next to (`TextFormField`)
  return (
    <Box paddingTop={2}>
      <Input
        id={`${daysAnswerId[kind]}.total`}
        name={`${daysAnswerId[kind]}.total`}
        label={formatMessage(parentalLeaveFormMessages.shared.totalTimeOnLeave)}
        value={
          remainingDays > 0
            ? formatMessage(
                parentalLeaveFormMessages.shared.rightsTotalMonthsAndDays,
                { months, days: remainingDays },
              )
            : formatMessage(
                parentalLeaveFormMessages.shared.rightsTotalMonths,
                {
                  months,
                },
              )
        }
        readOnly
        backgroundColor="blue"
      />
    </Box>
  )
}

export default RightsTotal

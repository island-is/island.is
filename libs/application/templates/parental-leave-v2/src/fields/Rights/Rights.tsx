import React, { FC } from 'react'

import {
  getApplicationAnswers,
  getMaxMultipleBirthsAndSingleParenttMonths,
  getMaxMultipleBirthsInMonths,
} from '../../lib/parentalLeaveUtils'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { defaultMonths, additionalSingleParentMonths } from '../../config'
import { SINGLE } from '../../constants'
import { YES } from '@island.is/application/core'

/**
 * Total entitlement plus the breakdown it is made of.
 *
 * The wording comes from the same messages the deleted BoxChart used for these
 * exact quantities, so the single parent and multiple births distinctions read
 * the way they always have:
 *
 *   Standard:                      "Samtals: 6 mánuðir (6 mánuðir sjálfstæður réttur)"
 *   Single parent:                 personal months include the extra single parent months
 *   Multiple births:               "+ 2 mánuðir – sameiginlegur réttur vegna fjölbura"
 *   Single parent, multiple births: "+ 2 mánuðir – auka réttur vegna fjölbura"
 */
const Rights: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { otherParent, hasMultipleBirths } = getApplicationAnswers(
    application.answers,
  )
  const totalMonths = getMaxMultipleBirthsAndSingleParenttMonths(application)

  const personalMonths =
    otherParent === SINGLE
      ? defaultMonths + additionalSingleParentMonths
      : defaultMonths

  const breakdown = [
    formatMessage(parentalLeaveFormMessages.shared.yourRightsInMonths, {
      months: personalMonths,
    }),
  ]

  if (hasMultipleBirths === YES) {
    breakdown.push(
      formatMessage(
        otherParent === SINGLE
          ? parentalLeaveFormMessages.shared
              .yourSingleParentMultipleBirthsRightsInMonths
          : parentalLeaveFormMessages.shared.yourMultipleBirthsRightsInMonths,
        { months: getMaxMultipleBirthsInMonths(application.answers) },
      ),
    )
  }

  const total = formatMessage(
    parentalLeaveFormMessages.reviewScreen.rightsTotal,
    { months: totalMonths },
  )

  return (
    <Box marginBottom={6} marginTop={3}>
      <Box marginBottom={3}>
        <Input
          id="rightsMonths"
          name="rightsMonths"
          label={formatMessage(parentalLeaveFormMessages.shared.yourRights)}
          value={`${total} (${breakdown.join(' + ')})`}
          readOnly
          backgroundColor="blue"
        />
      </Box>
      <AlertMessage
        type="info"
        title={formatMessage(
          parentalLeaveFormMessages.personalAllowance.editAlertTitle,
        )}
        message={formatMessage(
          parentalLeaveFormMessages.shared.rightsInfoAlert,
          { months: totalMonths },
        )}
      />
    </Box>
  )
}

export default Rights

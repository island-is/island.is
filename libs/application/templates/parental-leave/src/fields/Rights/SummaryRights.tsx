import React from 'react'

import { Application } from '@island.is/application/types'
import { DataValue } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'

import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  getApplicationAnswers,
  getAvailablePersonalRightsInMonths,
  getAvailablePersonalRightsSingleParentInMonths,
  getAvailableRightsInMonths,
  getMultipleBirthsDays,
} from '../../lib/parentalLeaveUtils'
import { daysToMonths } from '../../lib/directorateOfLabour.utils'
import { SINGLE } from '../../constants'
import { NO, YES } from '@island.is/application/core'

interface SummaryRightsProps {
  application: Application
}

const round = (value: number) => Math.round(value * 100) / 100

export const SummaryRights = ({ application }: SummaryRightsProps) => {
  const { formatMessage } = useLocale()
  const {
    isRequestingRights,
    isRequestingRightsSecondary,
    requestDays,
    isGivingRights,
    giveDays,
    otherParent,
  } = getApplicationAnswers(application.answers)
  const hasSelectedOtherParent = otherParent !== NO && otherParent !== SINGLE
  const personalMonths =
    otherParent !== SINGLE
      ? getAvailablePersonalRightsInMonths(application)
      : getAvailablePersonalRightsSingleParentInMonths(application)
  const total = round(getAvailableRightsInMonths(application))
  const requested = daysToMonths(requestDays)
  const given = daysToMonths(Math.abs(giveDays))
  const common = daysToMonths(getMultipleBirthsDays(application))

  return (
    <DataValue
      label={formatMessage(parentalLeaveFormMessages.shared.yourRights)}
      value={
        <Box>
          <Text>
            {formatMessage(parentalLeaveFormMessages.reviewScreen.rightsTotal, {
              months: total,
            })}
          </Text>

          <Box display="inline">
            <Text as="span">
              {formatMessage(
                parentalLeaveFormMessages.reviewScreen.rightsPersonalMonths,
                { months: personalMonths },
              )}
            </Text>

            {common > 0 && otherParent === SINGLE && (
              <>
                {', '}
                <Text as="span">
                  {formatMessage(
                    parentalLeaveFormMessages.reviewScreen
                      .rightsSingleParentMultipleBirths,
                    {
                      common: round(common),
                    },
                  )}
                </Text>
              </>
            )}

            {common > 0 && otherParent !== SINGLE && (
              <>
                {', '}
                <Text as="span">
                  {formatMessage(
                    parentalLeaveFormMessages.reviewScreen.rightsMultipleBirths,
                    {
                      common: round(common),
                    },
                  )}
                </Text>
              </>
            )}

            {hasSelectedOtherParent &&
              (isRequestingRights === YES || isRequestingRightsSecondary) &&
              requestDays > 0 && (
                <>
                  {', '}
                  <Text as="span">
                    {formatMessage(
                      parentalLeaveFormMessages.reviewScreen
                        .rightsAllowanceRequested,
                      {
                        requested: round(requested),
                      },
                    )}
                  </Text>
                </>
              )}

            {hasSelectedOtherParent &&
              isGivingRights === YES &&
              giveDays !== 0 && (
                <>
                  {', '}
                  <Text as="span">
                    {formatMessage(
                      parentalLeaveFormMessages.reviewScreen
                        .rightsAllowanceGiven,
                      {
                        given: round(given),
                      },
                    )}
                  </Text>
                </>
              )}
          </Box>
        </Box>
      }
    />
  )
}

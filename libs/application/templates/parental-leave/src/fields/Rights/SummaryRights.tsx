import React from 'react'

import { Application } from '@island.is/application/core'
import { DataValue } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'

import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  getAvailablePersonalRightsInMonths,
  getAvailableRightsInMonths,
} from '../../lib/parentalLeaveUtils'
import { daysToMonths } from '../../lib/directorateOfLabour.utils'
import { YES } from '../../constants'
import { useApplicationAnswers } from '../../hooks/useApplicationAnswers'

interface SummaryRightsProps {
  application: Application
}

const round = (value: number) => Math.round(value * 100) / 100

export const SummaryRights = ({ application }: SummaryRightsProps) => {
  const { formatMessage } = useLocale()
  const {
    isRequestingRights,
    requestDays,
    isGivingRights,
    giveDays,
  } = useApplicationAnswers(application)
  const personalMonths = getAvailablePersonalRightsInMonths(application)
  const total = round(getAvailableRightsInMonths(application))
  const requested = daysToMonths(requestDays)
  const given = daysToMonths(Math.abs(giveDays))

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

            {isRequestingRights === YES && requestDays > 0 && (
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

            {isGivingRights === YES && giveDays !== 0 && (
              <>
                {', '}
                <Text as="span">
                  {formatMessage(
                    parentalLeaveFormMessages.reviewScreen.rightsAllowanceGiven,
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

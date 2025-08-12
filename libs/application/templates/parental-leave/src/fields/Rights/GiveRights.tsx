import React, { FC, useState } from 'react'
import {
  formatText,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { FieldBaseProps, ValidAnswers } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RadioController } from '@island.is/shared/form-fields'

import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { defaultMonths } from '../../config'

const GiveRights: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  error,
  field,
  application,
}) => {
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers

  const { formatMessage } = useLocale()

  const [statefulAnswer, setStatefulAnswer] =
    useState<ValidAnswers>(currentAnswer)

  const boxChartKeys = [
    {
      label: () => ({
        ...parentalLeaveFormMessages.shared.yourRightsInMonths,
        values: { months: defaultMonths },
      }),
      bulletStyle: 'blue',
    },
  ]

  return (
    <Box marginTop={3} marginBottom={2} key={field.id}>
      <Box paddingY={3}>
        <RadioController
          id={field.id}
          defaultValue={
            statefulAnswer !== undefined ? [statefulAnswer] : undefined
          }
          options={[
            {
              label: formatText(
                parentalLeaveFormMessages.shared.giveRightsYes,
                application,
                formatMessage,
              ),
              value: YES,
            },
            {
              label: formatText(
                parentalLeaveFormMessages.shared.giveRightsNo,
                application,
                formatMessage,
              ),
              value: NO,
            },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          largeButtons
        />
      </Box>

      {error && (
        <Box color="red400" padding={2}>
          <Text color="red400">
            {formatMessage(parentalLeaveFormMessages.errors.requiredAnswer)}
          </Text>
        </Box>
      )}

      {statefulAnswer === NO && (
        <BoxChart
          application={application}
          boxes={defaultMonths}
          calculateBoxStyle={() => {
            return 'blue'
          }}
          keys={boxChartKeys as BoxChartKey[]}
        />
      )}
    </Box>
  )
}

export default GiveRights

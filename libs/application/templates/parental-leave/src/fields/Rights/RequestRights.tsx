import React, { FC, useState } from 'react'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { FieldBaseProps, ValidAnswers } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { defaultMonths, maxMonths } from '../../config'

const RequestRights: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  error,
  field,
  application,
}) => {
  const { formatMessage } = useLocale()
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers

  const [statefulAnswer, setStatefulAnswer] =
    useState<ValidAnswers>(currentAnswer)

  const numberOfBoxes = statefulAnswer === NO ? defaultMonths : maxMonths

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...parentalLeaveFormMessages.shared.yourRightsInMonths,
        values: { months: defaultMonths },
      }),
      bulletStyle: 'blue',
    },
  ]

  return (
    <Box marginTop={3} marginBottom={1} key={field.id}>
      <Box paddingY={3}>
        <RadioController
          id={field.id}
          error={error}
          defaultValue={
            statefulAnswer !== undefined ? [statefulAnswer] : undefined
          }
          options={[
            {
              label: formatMessage(
                parentalLeaveFormMessages.shared.requestRightsYes,
              ),
              value: YES,
            },
            {
              label: formatMessage(
                parentalLeaveFormMessages.shared.requestRightsNo,
              ),
              value: NO,
            },
          ]}
          onSelect={(newAnswer) => {
            setStatefulAnswer(newAnswer as ValidAnswers)
          }}
          largeButtons
        />
      </Box>

      {/* No answer yet, so show them the last box as gray */}
      {!statefulAnswer && (
        <BoxChart
          application={application}
          boxes={numberOfBoxes}
          calculateBoxStyle={(index) => {
            if (index === defaultMonths) {
              return 'grayWithLines'
            }
            return 'blue'
          }}
          keys={boxChartKeys as BoxChartKey[]}
        />
      )}

      {/* They won't request time, so show all as blue */}
      {statefulAnswer === NO && (
        <BoxChart
          application={application}
          boxes={numberOfBoxes}
          calculateBoxStyle={() => {
            return 'blue'
          }}
          keys={boxChartKeys as BoxChartKey[]}
        />
      )}

      {/* They will request time, so the form will show the slider field which will include its own BoxChart */}
    </Box>
  )
}

export default RequestRights

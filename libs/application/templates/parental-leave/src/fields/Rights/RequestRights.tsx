import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { Box, Text } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m, mm } from '../../lib/messages'
import config from '../../config'

type ValidAnswers = 'yes' | 'no' | undefined

const RequestRights: FC<FieldBaseProps> = ({ error, field, application }) => {
  const { formatMessage } = useLocale()
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers

  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )

  const numberOfBoxes =
    statefulAnswer === 'no' ? config.defaultMonths : config.defaultMonths + 1

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...m.yourRightsInMonths,
        values: { months: config.defaultMonths },
      }),
      bulletStyle: 'blue',
    },
  ]

  return (
    <Box marginTop={3} marginBottom={1} key={field.id}>
      <Box paddingY={3}>
        <RadioController
          id={field.id}
          defaultValue={
            statefulAnswer !== undefined ? [statefulAnswer] : undefined
          }
          options={[
            { label: formatMessage(m.requestRightsYes), value: 'yes' },
            { label: formatMessage(m.requestRightsNo), value: 'no' },
          ]}
          onSelect={(newAnswer) => {
            setStatefulAnswer(newAnswer as ValidAnswers)
          }}
          largeButtons
        />
      </Box>
      {error && (
        <Box color="red400" padding={2}>
          <Text color="red400">{formatMessage(mm.errors.requiredAnswer)}</Text>
        </Box>
      )}

      {/* No answer yet, so show them the last box as gray */}
      {!statefulAnswer && (
        <BoxChart
          application={application}
          boxes={numberOfBoxes}
          calculateBoxStyle={(index) => {
            if (index === config.defaultMonths) {
              return 'grayWithLines'
            }
            return 'blue'
          }}
          keys={boxChartKeys as BoxChartKey[]}
        />
      )}

      {/* They won't request time, so show all as blue */}
      {statefulAnswer === 'no' && (
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

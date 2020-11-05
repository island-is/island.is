import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { Box, Typography } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'

type ValidAnswers = 'yes' | 'no' | undefined

const RequestRights: FC<FieldBaseProps> = ({ error, field, application }) => {
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers
  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )

  const numberOfBoxes = statefulAnswer === 'no' ? 6 : 7

  const boxChartKeys = [{ label: '6 personal months', bulletStyle: 'blue' }]
  if (statefulAnswer === 'yes') {
    boxChartKeys.push({
      label: '1 shared month',
      bulletStyle: 'greenWithLines',
    })
  }
  return (
    <Box marginY={3} key={field.id}>
      <Box
        background={error ? 'red100' : 'blue100'}
        padding={3}
        marginBottom={3}
      >
        <RadioController
          id={field.id}
          defaultValue={
            statefulAnswer === undefined ? statefulAnswer : [statefulAnswer]
          }
          options={[
            {
              label: 'Yes, I want to request extra time from my partner',
              value: 'yes',
            },
            { label: 'No, I will only use my rights', value: 'no' },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          emphasize
          largeButtons
        />
      </Box>
      {error && (
        <Box color="red400" padding={2}>
          <Typography variant="pSmall" color="red400">
            You have to provide an answer to this question in order to proceed.
          </Typography>
        </Box>
      )}
      <BoxChart
        boxes={numberOfBoxes}
        calculateBoxStyle={(index) => {
          if (index === 6) {
            if (statefulAnswer === 'yes') {
              return 'greenWithLines'
            }
            return 'grayWithLines'
          }
          return 'blue'
        }}
        keys={boxChartKeys as BoxChartKey[]}
      />
    </Box>
  )
}

export default RequestRights

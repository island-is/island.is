import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { Box, Typography } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'

type ValidAnswers = 'yes' | 'no' | undefined

const GiveRights: FC<FieldBaseProps> = ({ error, field, application }) => {
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers
  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )

  const boxChartKeys =
    statefulAnswer === 'yes'
      ? [
          { label: '5 personal months', bulletStyle: 'blue' },
          {
            label: '1 shared month given away to other parent',
            bulletStyle: 'greenWithLines',
          },
        ]
      : [{ label: '6 personal months', bulletStyle: 'blue' }]

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
              label:
                'Yes, I want to give up to 1 month of my rights to the other parent',
              value: 'yes',
            },
            { label: 'No, I want to keep my months to myself', value: 'no' },
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
        boxes={6}
        calculateBoxStyle={(index) => {
          if (index === 5) {
            if (statefulAnswer === 'yes') {
              return 'greenWithLines'
            } else if (statefulAnswer === undefined) return 'grayWithLines'
          }
          return 'blue'
        }}
        keys={boxChartKeys as BoxChartKey[]}
      />
    </Box>
  )
}

export default GiveRights

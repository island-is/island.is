import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { Box, Text } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

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

  const numberOfBoxes = statefulAnswer === 'no' ? 6 : 7

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({ ...m.yourRightsInMonths, values: { months: '6' } }),
      bulletStyle: 'blue',
    },
  ]
  if (statefulAnswer === 'yes') {
    boxChartKeys.push({
      label: m.requestRightsMonths,
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
            { label: formatMessage(m.requestRightsYes), value: 'yes' },
            { label: formatMessage(m.requestRightsNo), value: 'no' },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          emphasize
          largeButtons
        />
      </Box>
      {error && (
        <Box color="red400" padding={2}>
          <Text color="red400">{formatMessage(m.requiredAnswerError)}</Text>
        </Box>
      )}
      <BoxChart
        application={application}
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

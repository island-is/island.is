import React, { FC, useState } from 'react'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RadioController } from '@island.is/shared/form-fields'
import { m, mm } from '../../lib/messages'
import { defaultMonths } from '../../config'
import { YES, NO } from '../../constants'

type ValidAnswers = 'yes' | 'no' | undefined

const GiveRights: FC<FieldBaseProps> = ({ error, field, application }) => {
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers

  const { formatMessage } = useLocale()

  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )

  const boxChartKeys = [
    {
      label: () => ({
        ...m.yourRightsInMonths,
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
              label: formatText(m.giveRightsYes, application, formatMessage),
              value: YES,
            },
            {
              label: formatText(m.giveRightsNo, application, formatMessage),
              value: NO,
            },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          largeButtons
        />
      </Box>

      {error && (
        <Box color="red400" padding={2}>
          <Text color="red400">{formatMessage(mm.errors.requiredAnswer)}</Text>
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

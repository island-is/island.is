import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getExpectedDateOfBirth } from '../parentalLeaveUtils'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

type ValidAnswers = 'dateOfBirth' | 'specificDate' | undefined

const FirstPeriodStart: FC<FieldBaseProps> = ({
  error,
  field,
  application,
}) => {
  const { register } = useFormContext()
  const { formatMessage } = useLocale()
  const expectedDateOfBirth = getExpectedDateOfBirth(application)
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    undefined,
  ) as ValidAnswers
  const currentStartDateAnswer = getValueViaPath(
    application.answers,
    'periods[0].startDate',
    expectedDateOfBirth,
  ) as string
  const [statefulAnswer, setStatefulAnswer] = useState<ValidAnswers>(
    currentAnswer,
  )

  return (
    <Box marginY={3} key={field.id}>
      <FieldDescription
        description="Þú mátt kjósa að byrja á áætluðum fæðingardegi, eða ákveðinni dagsetningu. Athugaðu að ekki er hægt að nýta réttindi til fæðingarorlofs 18 mánuðum eftir fæðingu barnsins."
        // description="You can choose to start on the date of birth, or on a specific date. Please note, that your rights end 18 months after the date of birth."
      />
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
              // label: 'I will start from the date of birth',
              label: 'Ég vil byrja á áætluðum fæðingardegi',
              value: 'dateOfBirth',
              tooltip:
                'Ef barnið fæðist á annarri dagsetningu en áætlað er, þá mun fæðingarorlofið og lengd þess aðlagast raunverulegum fæðingardegi barnsins.',
              //tooltip:  'If the child is born on another date than the expected date of birth, the parental leave and its duration will adjust to the real date of birth',
            },
            {
              // label: 'I will start on a specific date',
              label: 'Ég vil byrja á ákveðinni dagsetningu',
              tooltip:
                'Ef barnið fæðist á annarri dagsetningu en áætlað er, þá mun fæðingarorlofið og lengd þess EKKI aðlagast út frá raunverulegum fæðingardegi barnsins ef þessi valmöguleiki er valinn.',
              // tooltip: 'If the child is born on another date than the expected date of birth, the parental leave and its duration will !!!!NOT!!!! adjust to the real date of birth',
              value: 'specificDate',
            },
          ]}
          onSelect={(newAnswer) => setStatefulAnswer(newAnswer as ValidAnswers)}
          emphasize
          largeButtons
        />
        <input
          type="hidden"
          value={
            statefulAnswer === 'dateOfBirth'
              ? expectedDateOfBirth
              : currentStartDateAnswer
          }
          ref={register}
          name="periods[0].startDate"
        />
      </Box>
      {error && (
        <Box color="red400" padding={2}>
          <Text variant="default" color="red400">
            {formatMessage(m.requiredAnswerError)}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default FirstPeriodStart

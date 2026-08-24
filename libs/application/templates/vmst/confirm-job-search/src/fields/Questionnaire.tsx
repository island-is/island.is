import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/types'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { Box, Scale, Stack, Text } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { Question } from '../utils/types'
import { questionnaire as questionnaireMessages } from '../lib/messages'

const QUESTIONS_PATH = 'questionnaire.data.questions'
const ANSWERS_PREFIX = 'questionnaire'

export const Questionnaire: FC<FieldBaseProps> = ({
  application,
  errors,
  setBeforeSubmitCallback,
}) => {
  const { lang, formatMessage } = useLocale()
  const { clearErrors, setError, setValue, getValues } = useFormContext()

  const questions =
    getValueViaPath<Question[]>(application.externalData, QUESTIONS_PATH, []) ??
    []

  const sorted = [...questions].sort((a, b) => a.order - b.order)

  setBeforeSubmitCallback?.(async () => {
    const values = getValues()
    let hasMissing = false

    for (const q of questions) {
      if (!q.required) continue
      const id = `${ANSWERS_PREFIX}.${q.field}`
      const val = getValueViaPath<string | number>(values, id)
      if (val === undefined || val === null || val === '') {
        setError(id, {
          type: 'required',
          message: formatMessage(questionnaireMessages.requiredAnswerError),
        })
        hasMissing = true
      }
    }

    if (hasMissing) {
      return [false, '']
    }
    return [true, null]
  })

  return (
    <Stack space={4}>
      {sorted.map((question) => {
        const id = `${ANSWERS_PREFIX}.${question.field}`
        const label = lang === 'en' ? question.questionEN : question.questionIS
        // getErrorViaPath returns the raw value at the path; RHF's setError
        // writes a { type, message, ref } object, so normalize to a string.
        const rawError = errors && getErrorViaPath(errors, id)
        const error =
          typeof rawError === 'object' && rawError !== null
            ? (rawError as { message?: string }).message
            : (rawError as string | undefined)
        const defaultValue = getValueViaPath<string | number>(
          application.answers,
          id,
        )

        if (question.type === 'radio') {
          return (
            <Box key={id}>
              <Text variant="h4" as="h4" marginBottom={2}>
                {label}{' '}
                {question.required && (
                  <Text as="span" variant="eyebrow" color="red400">
                    *
                  </Text>
                )}
              </Text>
              <RadioController
                id={id}
                name={id}
                error={error}
                largeButtons={false}
                defaultValue={
                  defaultValue !== undefined ? String(defaultValue) : undefined
                }
                options={question.answers.map((a) => ({
                  value: String(a.value),
                  label: lang === 'en' ? a.textEN : a.textIS,
                }))}
              />
            </Box>
          )
        }

        if (question.type === 'scale') {
          const min = question.minValue ?? 0
          const max = question.maxValue ?? 10
          return (
            <Box key={id}>
              <Controller
                name={id}
                defaultValue={defaultValue ?? ''}
                render={({ field: { onChange, value } }) => (
                  <Scale
                    id={id}
                    label={label}
                    min={min}
                    max={max}
                    value={value ? String(value) : null}
                    onChange={(val: string) => {
                      clearErrors(id)
                      onChange(val)
                      setValue(id, val)
                    }}
                    error={error}
                    required={question.required}
                  />
                )}
              />
            </Box>
          )
        }

        return null
      })}
    </Stack>
  )
}

export default Questionnaire

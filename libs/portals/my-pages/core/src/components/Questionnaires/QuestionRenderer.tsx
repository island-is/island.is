import {
  QuestionnaireAnswerOptionType,
  QuestionnaireOptionsLabelValue,
  QuestionnaireQuestion,
} from '@island.is/api/schema'
import { Box, DatePicker, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import HtmlParser from 'react-html-parser'
import useIsMobile from '../../hooks/useIsMobile/useIsMobile'
import { QuestionAnswer } from '../../types/questionnaire'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { Multiple } from '../Questionnaires/QuestionsTypes/Multiple'
import { Radio } from '../Questionnaires/QuestionsTypes/Radio'
import { TextInput } from '../Questionnaires/QuestionsTypes/TextInput'
import { Thermometer } from '../Questionnaires/QuestionsTypes/Thermometer'
import { Scale } from './QuestionsTypes/Scale'
import { Table } from './QuestionsTypes/Table'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

interface QuestionRendererProps {
  question: QuestionnaireQuestion
  answer?: QuestionAnswer
  onAnswerChange: (answer: QuestionAnswer) => void
  disabled?: boolean
  error?: string
}

export const QuestionRenderer: FC<QuestionRendererProps> = ({
  question,
  answer,
  onAnswerChange,
  disabled = false,
  error,
}) => {
  const { formatMessage } = useLocale()
  const isMobile = useIsMobile()

  const handleValueChange = (
    value: string | string[] | number,
    _extraAnswers?: { [key: string]: QuestionAnswer },
  ) => {
    const questionType = question.answerOptions.type

    // Helper function to get option label for a value
    const getOptionLabel = (val: string): string | undefined => {
      const options = question.answerOptions.options
      if (!options) return undefined
      const option = options.find((opt) => opt.value === val)
      return option?.label ?? undefined
    }

    // For types that need option labels: radio, checkbox, thermometer, slider
    const needsOptionLabel = [
      QuestionnaireAnswerOptionType.radio,
      QuestionnaireAnswerOptionType.checkbox,
      QuestionnaireAnswerOptionType.thermometer,
      QuestionnaireAnswerOptionType.slider,
    ].includes(questionType)

    let answers: Array<{ label?: string; value: string }>

    if (Array.isArray(value)) {
      // For checkboxes (multiple values)
      answers = value.map((val) => ({
        label: needsOptionLabel ? getOptionLabel(String(val)) : undefined,
        value: String(val),
      }))
    } else {
      // For single values
      answers = [
        {
          label: needsOptionLabel ? getOptionLabel(String(value)) : undefined,
          value: String(value),
        },
      ]
    }

    onAnswerChange({
      questionId: question.id,
      question: question.label,
      answers,
      type: questionType,
    })
  }

  const renderQuestionByType = () => {
    if (!question.answerOptions) return null

    const typename = question.answerOptions.type.toString()

    switch (typename) {
      case QuestionnaireAnswerOptionType.text: {
        return (
          <TextInput
            id={question.id}
            placeholder={question.answerOptions.placeholder ?? undefined}
            value={answer?.answers?.[0]?.value ?? undefined}
            onChange={(value: string) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            maxLength={
              question.answerOptions.maxLength
                ? Number(question.answerOptions.maxLength)
                : undefined
            }
          />
        )
      }

      case QuestionnaireAnswerOptionType.textarea: {
        return (
          <TextInput
            id={question.id}
            placeholder={question.answerOptions.placeholder ?? undefined}
            value={answer?.answers?.[0]?.value ?? undefined}
            onChange={(value: string) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            multiline
            rows={4}
            maxLength={
              question.answerOptions.maxLength
                ? Number(question.answerOptions.maxLength)
                : undefined
            }
          />
        )
      }

      case QuestionnaireAnswerOptionType.number: {
        const firstValue = answer?.answers?.[0]?.value
        return (
          <TextInput
            id={question.id}
            placeholder={question.answerOptions.placeholder ?? undefined}
            value={firstValue ?? ''}
            onChange={(value: string) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            type={question.answerOptions.decimal ? 'decimal' : 'number'}
            min={question.answerOptions.min ?? undefined}
            max={question.answerOptions.max ?? undefined}
          />
        )
      }

      case QuestionnaireAnswerOptionType.radio: {
        const options = question.answerOptions.options
        if (!options) return null
        return (
          <Radio
            id={question.id}
            options={options.map((option) => ({
              value: option.value ?? '',
              label: option.label ?? '',
            }))}
            value={answer?.answers?.[0]?.value ?? ''}
            onChange={(value: string) => {
              handleValueChange(value, {})
            }}
            disabled={disabled}
            error={error}
            direction="vertical"
          />
        )
      }

      case QuestionnaireAnswerOptionType.checkbox: {
        const options = question.answerOptions.options
        if (!options) return null
        const selectedValues = answer?.answers?.map((a) => a.value) ?? []
        return (
          <Multiple
            id={question.id}
            options={options.map((option) => ({
              value: option.value ?? '',
              label: option.label ?? '',
            }))}
            value={selectedValues}
            onChange={(values: string[]) => handleValueChange(values)}
            disabled={disabled}
            error={error}
            direction="vertical"
          />
        )
      }

      case QuestionnaireAnswerOptionType.scale: {
        const answerOptions = question.answerOptions

        return (
          <Scale
            id={question.id}
            min={answerOptions.min ?? '0'}
            max={answerOptions.max ?? '10'}
            value={answer?.answers?.[0]?.value ?? undefined}
            onChange={(value: string) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            minLabel={answerOptions.minLabel ?? undefined}
            maxLabel={answerOptions.maxLabel ?? undefined}
            showLabels={!!(answerOptions.minLabel || answerOptions.maxLabel)}
          />
        )
      }

      case QuestionnaireAnswerOptionType.thermometer: {
        const answerOptions = question.answerOptions
        return (
          <Thermometer
            id={question.id}
            min={answerOptions.min ?? '0'}
            max={answerOptions.max ?? '10'}
            value={answer?.answers?.[0]?.value ?? null}
            onChange={(value: string) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            minLabel={answerOptions.minLabel ?? 'Min'}
            maxLabel={answerOptions.maxLabel ?? 'Max'}
          />
        )
      }

      case QuestionnaireAnswerOptionType.slider: {
        const options = question.answerOptions.options ?? []
        const firstValue = answer?.answers?.[0]?.value
        const selectedValue: QuestionnaireOptionsLabelValue | undefined = {
          id: question.id,
          label: question.label,
          value: firstValue ? String(firstValue) : '',
        }
        const selectedIndex = options.findIndex(
          (option) => option === selectedValue,
        )

        // If last option is selected, progress is 1, otherwise calculate percentage
        const progress =
          selectedIndex === options.length - 1
            ? 1
            : selectedIndex >= 0
            ? selectedIndex / (options.length - 1)
            : 0

        return (
          <Box width={'full'} paddingBottom={3}>
            <ProgressBar
              id={question.id}
              progress={progress}
              options={options?.map((option) => ({
                label: option.label ?? '',
                value: option.value ?? '',
              }))}
              selectedValue={selectedValue}
              onOptionClick={(value) => handleValueChange(value)}
            />
          </Box>
        )
      }

      case QuestionnaireAnswerOptionType.date:
      case QuestionnaireAnswerOptionType.datetime: {
        const dateValue = answer?.answers?.[0]?.value
        return (
          <Box width={isMobile ? 'full' : 'half'}>
            <DatePicker
              label=""
              locale="is"
              id={question.id}
              placeholderText={
                question.answerOptions.placeholder ||
                formatMessage(m.chooseDate)
              }
              selected={dateValue ? new Date(dateValue) : undefined}
              handleChange={(date: Date) =>
                handleValueChange(
                  date
                    ? question.answerOptions.type ===
                      QuestionnaireAnswerOptionType.datetime
                      ? date.toISOString()
                      : date.toISOString().split('T')[0]
                    : '',
                )
              }
              backgroundColor="blue"
              disabled={disabled}
              hasError={!!error}
              showTimeInput={
                question.answerOptions.type ===
                QuestionnaireAnswerOptionType.datetime
              }
              size="xs"
            />
          </Box>
        )
      }

      case QuestionnaireAnswerOptionType.table: {
        const columns = question.answerOptions.columns
        if (!columns) {
          console.error('Table question missing columns:', question)
          return null
        }
        return (
          <Table
            id={question.id}
            columns={columns}
            value={answer}
            onChange={onAnswerChange}
            disabled={disabled}
            error={error}
            numRows={
              question.answerOptions.numRows
                ? Number(question.answerOptions.numRows)
                : 1
            }
            maxRows={
              question.answerOptions.maxRows
                ? Number(question.answerOptions.maxRows)
                : 10
            }
          />
        )
      }

      default:
        return <Box marginY={4}></Box>
    }
  }

  return (
    <Box marginBottom={4}>
      <Text variant="h5" marginBottom={question.sublabel ? 1 : 3}>
        {HtmlParser(
          question.htmlLabel && question.htmlLabel.length > 0
            ? question.htmlLabel
            : question.label ?? '',
        )}
        {question.answerOptions.type === 'number' &&
          question.answerOptions.min &&
          question.answerOptions.max &&
          ' ' +
            question.answerOptions.min +
            ' - ' +
            question.answerOptions.max +
            ' '}
      </Text>
      {question.sublabel && (
        <Text variant="medium" color="dark400" marginBottom={3}>
          {HtmlParser(question.sublabel)}
        </Text>
      )}
      {renderQuestionByType()}
    </Box>
  )
}

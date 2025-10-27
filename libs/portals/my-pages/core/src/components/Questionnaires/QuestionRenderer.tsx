import React from 'react'
import { Box, Text, DatePicker } from '@island.is/island-ui/core'
import { TextInput } from '../Questionnaires/QuestionsTypes/TextInput'
import { Radio } from '../Questionnaires/QuestionsTypes/Radio'
import { Multiple } from '../Questionnaires/QuestionsTypes/Multiple'
import { Thermometer } from '../Questionnaires/QuestionsTypes/Thermometer'
import { QuestionAnswer } from '../../types/questionnaire'
import {
  QuestionnaireQuestion,
  QuestionnaireAnswerOptionType,
  QuestionnaireOptionsLabelValue,
} from '@island.is/api/schema'
import HtmlParser from 'react-html-parser'
import { Scale } from './QuestionsTypes/Scale'
import { ProgressBar } from '../ProgressBar/ProgressBar'

interface QuestionRendererProps {
  question: QuestionnaireQuestion
  answer?: QuestionAnswer
  onAnswerChange: (answer: QuestionAnswer) => void
  disabled?: boolean
  error?: string
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  answer,
  onAnswerChange,
  disabled = false,
  error,
}) => {
  const handleValueChange = (
    value: string | string[] | number,
    extraAnswers?: { [key: string]: QuestionAnswer },
  ) => {
    onAnswerChange({
      questionId: question.id,
      value,
      type: question.answerOptions.type,
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
            label={question.label}
            placeholder={question.answerOptions.placeholder ?? undefined}
            value={typeof answer?.value === 'string' ? answer.value : undefined}
            onChange={(value: string) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            maxLength={question.answerOptions.maxLength ?? undefined}
          />
        )
      }

      case QuestionnaireAnswerOptionType.textarea: {
        return (
          <TextInput
            id={question.id}
            label={question.label}
            placeholder={question.answerOptions.placeholder ?? undefined}
            value={typeof answer?.value === 'string' ? answer.value : undefined}
            onChange={(value: string) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            multiline
            rows={4}
            maxLength={question.answerOptions.maxLength ?? undefined}
          />
        )
      }

      case QuestionnaireAnswerOptionType.number: {
        return (
          <TextInput
            id={question.id}
            label={question.label}
            placeholder={question.answerOptions.placeholder || ''}
            value={
              typeof answer?.value === 'string'
                ? answer.value
                : typeof answer?.value === 'number'
                ? answer.value.toString()
                : ''
            }
            onChange={(value: string) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            type={question.answerOptions.decimal ? 'decimal' : 'number'}
            min={question.answerOptions.min || undefined}
            max={question.answerOptions.max || undefined}
          />
        )
      }

      case QuestionnaireAnswerOptionType.radio: {
        const options = question.answerOptions.options
        if (!options) return null
        return (
          <Radio
            id={question.id}
            label={question.label}
            options={options.map((option) => ({
              value: option.value || '',
              label: option.label || '',
            }))}
            value={typeof answer?.value === 'string' ? answer.value : ''}
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
        return (
          <Multiple
            id={question.id}
            label={question.label}
            options={options.map((option) => ({
              value: option.value || '',
              label: option.label || '',
            }))}
            value={Array.isArray(answer?.value) ? answer.value : []}
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
            label={question.label}
            min={answerOptions.min ?? '0'}
            max={answerOptions.max ?? '10'}
            value={typeof answer?.value === 'string' ? answer.value : undefined}
            onChange={(value: string) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            minLabel={answerOptions.minLabel || undefined}
            maxLabel={answerOptions.maxLabel || undefined}
            showLabels={!!(answerOptions.minLabel || answerOptions.maxLabel)}
          />
        )
      }

      case QuestionnaireAnswerOptionType.thermometer: {
        const answerOptions = question.answerOptions
        return (
          <Thermometer
            id={question.id}
            label={question.label}
            min={answerOptions.min || '0'}
            max={answerOptions.max || '10'}
            value={typeof answer?.value === 'string' ? answer.value : null}
            onChange={(value: string) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            minLabel={answerOptions.minLabel || 'Min'}
            maxLabel={answerOptions.maxLabel || 'Max'}
          />
        )
      }

      case QuestionnaireAnswerOptionType.slider: {
        const options = question.answerOptions.options || []
        const selectedValue: QuestionnaireOptionsLabelValue | undefined = {
          id: question.id,
          label: question.label,
          value: answer?.value ? String(answer.value) : '',
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
          <ProgressBar
            progress={progress}
            label={question.label}
            options={question.answerOptions.options?.map((option) => ({
              label: option.label || '',
              value: option.value || '',
            }))}
            selectedValue={selectedValue}
            onOptionClick={(value) => handleValueChange(value)}
          />
        )
      }

      case QuestionnaireAnswerOptionType.date:
      case QuestionnaireAnswerOptionType.datetime: {
        return (
          <DatePicker
            id={question.id}
            label={question.label}
            placeholderText={
              question.answerOptions.placeholder || 'Veldu dagsetningu'
            }
            selected={
              typeof answer?.value === 'string' && answer.value
                ? new Date(answer.value)
                : undefined
            }
            handleChange={(date: Date) =>
              handleValueChange(date ? date.toISOString().split('T')[0] : '')
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
        )
      }

      case QuestionnaireAnswerOptionType.label: {
        return (
          <Box marginY={4}>
            <Text variant="h5" marginBottom={2}>
              {HtmlParser(question.label)}
            </Text>
          </Box>
        )
      }

      default:
        return (
          <Box marginY={4}>
            <Text variant="default">{HtmlParser(question.label)}</Text>
          </Box>
        )
    }
  }

  return (
    <Box marginBottom={4}>
      {renderQuestionByType()}
      {question.sublabel && (
        <Text variant="small" color="dark300" marginY={2}>
          {HtmlParser(question.sublabel)}
        </Text>
      )}
    </Box>
  )
}

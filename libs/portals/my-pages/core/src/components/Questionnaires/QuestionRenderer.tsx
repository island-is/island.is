import {
  QuestionnaireAnswerOptionType,
  QuestionnaireOptionsLabelValue,
  QuestionnaireQuestion,
} from '@island.is/api/schema'
import { Box, DatePicker, Text } from '@island.is/island-ui/core'
import React from 'react'
import HtmlParser from 'react-html-parser'
import { QuestionAnswer } from '../../types/questionnaire'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { Multiple } from '../Questionnaires/QuestionsTypes/Multiple'
import { Radio } from '../Questionnaires/QuestionsTypes/Radio'
import { TextInput } from '../Questionnaires/QuestionsTypes/TextInput'
import { Thermometer } from '../Questionnaires/QuestionsTypes/Thermometer'
import { Scale } from './QuestionsTypes/Scale'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

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
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

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
      return option?.label || undefined
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
            label={question.label}
            placeholder={question.answerOptions.placeholder ?? undefined}
            value={answer?.answers?.[0]?.value ?? undefined}
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
            value={answer?.answers?.[0]?.value ?? undefined}
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
        const firstValue = answer?.answers?.[0]?.value
        return (
          <TextInput
            id={question.id}
            label={question.label}
            placeholder={question.answerOptions.placeholder || ''}
            value={firstValue ?? ''}
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
            label={question.label}
            options={options.map((option) => ({
              value: option.value || '',
              label: option.label || '',
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
            label={question.label}
            min={answerOptions.min ?? '0'}
            max={answerOptions.max ?? '10'}
            value={answer?.answers?.[0]?.value ?? undefined}
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
            value={answer?.answers?.[0]?.value ?? null}
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
          <Box width={isMobile ? 'full' : 'half'}>
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
          </Box>
        )
      }

      case QuestionnaireAnswerOptionType.date:
      case QuestionnaireAnswerOptionType.datetime: {
        const dateValue = answer?.answers?.[0]?.value
        return (
          <Box width="half">
            <DatePicker
              locale="is"
              id={question.id}
              label={question.label}
              placeholderText={
                question.answerOptions.placeholder || 'Veldu dagsetningu'
              }
              selected={dateValue ? new Date(dateValue) : undefined}
              handleChange={(date: Date) =>
                handleValueChange(
                  date
                    ? QuestionnaireAnswerOptionType.datetime
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

import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { TextInput } from '../Questionnaires/QuestionsTypes/TextInput'
import { Radio } from '../Questionnaires/QuestionsTypes/Radio'
import { Multiple } from '../Questionnaires/QuestionsTypes/Multiple'
import { Thermometer } from '../Questionnaires/QuestionsTypes/Thermometer'
import { QuestionAnswer } from '../../types/questionnaire'
import { Question, QuestionnaireAnswerOptionType } from '@island.is/api/schema'
import HtmlParser from 'react-html-parser'
import { Scale } from './QuestionsTypes/Scale'

interface QuestionRendererProps {
  question: Question
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
      extraAnswers,
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
            multiline
            required={question.display === 'required'}
            maxLength={question.answerOptions.maxLength || undefined}
          />
        )
      }

      case QuestionnaireAnswerOptionType.number: {
        return (
          <TextInput
            id={question.id}
            label={question.label}
            placeholder={
              question.answerOptions.placeholder ||
              question.answerOptions.sublabel ||
              ''
            }
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
            required={question.display === 'required'}
            type="number"
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
            options={options.map((option: string) => ({
              value: option,
              label: option,
            }))}
            value={typeof answer?.value === 'string' ? answer.value : ''}
            onChange={(value: string) => {
              handleValueChange(value, {})
            }}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
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
            options={options.map((option: string) => ({
              value: option,
              label: option,
            }))}
            value={Array.isArray(answer?.value) ? answer.value : []}
            onChange={(values: string[]) => handleValueChange(values)}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
            direction="vertical"
          />
        )
      }

      case QuestionnaireAnswerOptionType.scale: {
        const answerOptions = question.answerOptions
        if (
          answerOptions.minValue == null ||
          answerOptions.maxValue == null ||
          answerOptions.minLabel == null ||
          answerOptions.maxLabel == null
        )
          return null

        return (
          <Scale
            id={question.id}
            label={question.label}
            min={answerOptions.minValue}
            max={answerOptions.maxValue}
            value={typeof answer?.value === 'number' ? answer.value : undefined}
            onChange={(value: number) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
            minLabel={answerOptions.minLabel}
            maxLabel={answerOptions.maxLabel}
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
            min={0}
            max={100}
            value={typeof answer?.value === 'number' ? answer.value : 50}
            onChange={(value: number) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
            minLabel={answerOptions.minLabel || 'Min'}
            maxLabel={answerOptions.maxLabel || 'Max'}
            height={200}
          />
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
      {question.sublabel && (
        <Text variant="small" color="dark300" marginBottom={2}>
          {question.sublabel}
        </Text>
      )}
      {renderQuestionByType()}
    </Box>
  )
}

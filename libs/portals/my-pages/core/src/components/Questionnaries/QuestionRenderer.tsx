import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { TextInput } from '../Questionnaries/QuestionsTypes/TextInput'
import { Radio } from '../Questionnaries/QuestionsTypes/Radio'
import { Multiple } from '../Questionnaries/QuestionsTypes/Multiple'
import { Scale } from '../Questionnaries/QuestionsTypes/Scale'
import { Thermometer } from '../Questionnaries/QuestionsTypes/Thermometer'
import {
  HealthQuestionnaireQuestion,
  QuestionAnswer,
} from '../../types/questionnaire'

interface QuestionRendererProps {
  question: HealthQuestionnaireQuestion
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

  // TODO: Fix with enum when graphql is ready
  const renderQuestionByType = () => {
    switch (question.__typename) {
      case 'HealthQuestionnaireAnswerText':
        return (
          <TextInput
            id={question.id}
            label={question.label}
            placeholder={question.sublabel}
            value={typeof answer?.value === 'string' ? answer.value : ''}
            onChange={(value) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
          />
        )

      case 'HealthQuestionnaireAnswerNumber':
        return (
          <TextInput
            id={question.id}
            label={`${question.label}${
              question.unit ? ` (${question.unit})` : ''
            }`}
            placeholder={question.sublabel}
            value={
              typeof answer?.value === 'string'
                ? answer.value
                : typeof answer?.value === 'number'
                ? answer.value.toString()
                : ''
            }
            onChange={(value) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
            type="number"
            min={question.min}
            max={question.max}
            step={question.step}
          />
        )

      case 'HealthQuestionnaireAnswerTextArea':
        return (
          <TextInput
            id={question.id}
            label={question.label}
            placeholder={question.sublabel}
            value={typeof answer?.value === 'string' ? answer.value : ''}
            onChange={(value) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
            multiline
            rows={4}
          />
        )

      case 'HealthQuestionnaireAnswerRadio':
        if (!question.answerOptions) return null
        return (
          <Radio
            id={question.id}
            label={question.label}
            options={question.answerOptions.map((option) => ({
              value: option.id,
              label: option.label,
            }))}
            value={typeof answer?.value === 'string' ? answer.value : ''}
            onChange={(value) => {
              handleValueChange(value, {})
            }}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
            direction="vertical"
          />
        )

      case 'HealthQuestionnaireAnswerMultiple':
        if (!question.answerOptions) return null
        return (
          <Multiple
            id={question.id}
            label={question.label}
            options={question.answerOptions.map((option) => ({
              value: option.id,
              label: option.label,
            }))}
            value={Array.isArray(answer?.value) ? answer.value : []}
            onChange={(values) => handleValueChange(values)}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
            direction="vertical"
          />
        )

      case 'HealthQuestionnaireAnswerScale': {
        if (!question.answerOptions) return null
        const scaleOptions = question.answerOptions
          .map((opt) => parseInt(opt.id, 10))
          .filter((n) => isFinite(n))
          .sort((a, b) => a - b)
        const minScale = Math.min(...scaleOptions)
        const maxScale = Math.max(...scaleOptions)

        return (
          <Scale
            id={question.id}
            label={question.label}
            min={minScale}
            max={maxScale}
            value={typeof answer?.value === 'number' ? answer.value : undefined}
            onChange={(value) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
            minLabel={question.minLabel}
            maxLabel={question.maxLabel}
            showLabels={!!(question.minLabel || question.maxLabel)}
          />
        )
      }

      case 'HealthQuestionnaireAnswerThermometer':
        return (
          <Thermometer
            id={question.id}
            label={question.label}
            min={0}
            max={100}
            value={typeof answer?.value === 'number' ? answer.value : 50}
            onChange={(value) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
            minLabel={question.minLabel}
            maxLabel={question.maxLabel}
            height={200}
          />
        )

      default:
        return (
          <Box
            padding={2}
            style={{ backgroundColor: '#f0f0f0', borderRadius: '4px' }}
          >
            <Text variant="small" color="dark300">
              Unsupported question type: {question.__typename}
            </Text>
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

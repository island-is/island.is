import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { TextInput } from '../Questionnaires/QuestionsTypes/TextInput'
import { Radio } from '../Questionnaires/QuestionsTypes/Radio'
import { Multiple } from '../Questionnaires/QuestionsTypes/Multiple'
import { Thermometer } from '../Questionnaires/QuestionsTypes/Thermometer'
import { QuestionAnswer } from '../../types/questionnaire'
import { Question } from '@island.is/api/schema'
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

  // TODO: Fix with enum when graphql is ready
  const renderQuestionByType = () => {
    switch (question.answerOptions?.type?.__typename) {
      case 'HealthQuestionnaireAnswerText': {
        const textType =
          question.answerOptions?.type?.__typename ===
          'HealthQuestionnaireAnswerText'
            ? question.answerOptions.type
            : null
        return (
          <TextInput
            id={question.id}
            label={question.label}
            placeholder={question.answerOptions.type.sublabel ?? undefined}
            value={typeof answer?.value === 'string' ? answer.value : undefined}
            onChange={(value: string) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            multiline
            required={question.display === 'required'}
            maxLength={textType?.maxLength || undefined}
          />
        )
      }

      case 'HealthQuestionnaireAnswerNumber': {
        const numberType =
          question.answerOptions?.type?.__typename ===
          'HealthQuestionnaireAnswerNumber'
            ? question.answerOptions.type
            : null
        return (
          <TextInput
            id={question.id}
            label={question.label}
            placeholder={
              numberType?.placeholder ||
              question.answerOptions.type.sublabel ||
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
            min={numberType?.min || undefined}
            max={numberType?.max || undefined}
          />
        )
      }

      case 'HealthQuestionnaireAnswerRadio':
        if (
          !question.answerOptions?.type ||
          question.answerOptions.type.__typename !==
            'HealthQuestionnaireAnswerRadio'
        )
          return null
        return (
          <Radio
            id={question.id}
            label={question.label}
            options={question.answerOptions.type.options.map((option) => ({
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

      case 'HealthQuestionnaireAnswerCheckbox':
        if (
          !question.answerOptions?.type ||
          question.answerOptions.type.__typename !==
            'HealthQuestionnaireAnswerCheckbox'
        )
          return null
        return (
          <Multiple
            id={question.id}
            label={question.label}
            options={question.answerOptions.type.options.map((option) => ({
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

      case 'HealthQuestionnaireAnswerScale': {
        if (
          !question.answerOptions?.type ||
          question.answerOptions.type.minValue == null ||
          question.answerOptions.type.maxValue == null ||
          question.answerOptions.type.minLabel == null ||
          question.answerOptions.type.maxLabel == null
        )
          return null

        return (
          <Scale
            id={question.id}
            label={question.label}
            min={question.answerOptions.type.minValue}
            max={question.answerOptions.type.maxValue}
            value={typeof answer?.value === 'number' ? answer.value : undefined}
            onChange={(value: number) => handleValueChange(value)}
            disabled={disabled}
            error={error}
            required={question.display === 'required'}
            minLabel={question.answerOptions.type.minLabel}
            maxLabel={question.answerOptions.type.maxLabel}
            showLabels={
              !!(
                question.answerOptions.type.minLabel ||
                question.answerOptions.type.maxLabel
              )
            }
          />
        )
      }

      case 'HealthQuestionnaireAnswerThermometer':
        if (
          !question.answerOptions?.type ||
          question.answerOptions.type.__typename !==
            'HealthQuestionnaireAnswerThermometer'
        )
          return null
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
            minLabel={question.answerOptions.type.minLabel}
            maxLabel={question.answerOptions.type.maxLabel}
            height={200}
          />
        )

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

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Box, Text, Stack, Button } from '@island.is/island-ui/core'
import { QuestionRenderer } from '../Questionnaires/QuestionRenderer'
import { Stepper, Step } from '../Questionnaires/Stepper'
import { isQuestionVisible } from './utils/visibilityUtils'

import {
  HealthQuestionnaire,
  HealthQuestionnaireQuestion,
  QuestionAnswer,
} from '../../types/questionnaire'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
interface GenericQuestionnaireProps {
  questionnaire: HealthQuestionnaire
  onSubmit: (answers: { [key: string]: QuestionAnswer }) => void
  onCancel?: () => void
  enableStepper?: boolean
  questionsPerStep?: number
  submitLabel?: string
  cancelLabel?: string
}

export const GenericQuestionnaire: React.FC<GenericQuestionnaireProps> = ({
  questionnaire,
  onSubmit,
  onCancel,
  enableStepper = false,
  questionsPerStep = 3,
  submitLabel = 'Staðfesta',
  cancelLabel = 'Hætta við',
}) => {
  const { formatMessage } = useLocale()
  const [answers, setAnswers] = useState<{ [key: string]: QuestionAnswer }>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Filter questions based on visibility conditions
  const visibleQuestions = useMemo(() => {
    return questionnaire.questions.filter((question) =>
      isQuestionVisible(
        question.id,
        question.dependsOn,
        question.visibilityCondition,
        answers,
      ),
    )
  }, [questionnaire.questions, answers])

  // Split questions into steps if stepper is enabled
  const questionSteps = useMemo(() => {
    return enableStepper
      ? visibleQuestions.reduce(
          (steps: HealthQuestionnaireQuestion[][], question, index) => {
            const stepIndex = Math.floor(index / questionsPerStep)
            if (!steps[stepIndex]) {
              steps[stepIndex] = []
            }
            steps[stepIndex].push(question)
            return steps
          },
          [],
        )
      : [visibleQuestions]
  }, [visibleQuestions, enableStepper, questionsPerStep])

  useEffect(() => {
    if (questionSteps.length > 0) {
      setCurrentStep((prevStep) =>
        Math.max(0, Math.min(prevStep, questionSteps.length - 1)),
      )
    }
  }, [questionSteps.length])

  // Create stepper steps
  const steps: Step[] = questionSteps.map((_, index) => ({
    id: `step-${index}`,
    title: `Step ${index + 1}`,
    description: `Questions ${index * questionsPerStep + 1}-${Math.min(
      (index + 1) * questionsPerStep,
      visibleQuestions.length,
    )}`,
    completed: false,
  }))

  const handleAnswerChange = useCallback((answer: QuestionAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [answer.questionId]: answer,
    }))

    setErrors((prev) => {
      const { [answer.questionId]: _, ...newErrors } = prev
      return newErrors
    })
  }, [])

  const validateCurrentStep = (): boolean => {
    const currentQuestions = questionSteps[currentStep] || []
    const newErrors: { [key: string]: string } = {}
    let isValid = true

    currentQuestions.forEach((question) => {
      if (question.display === 'required') {
        const answer = answers[question.id]

        if (
          answer == null ||
          answer.value == null ||
          (typeof answer.value === 'string' && !answer.value.trim()) ||
          (Array.isArray(answer.value) && answer.value.length === 0)
        ) {
          newErrors[question.id] = formatMessage(m.requiredQuestion)
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < questionSteps.length - 1) {
        setCurrentStep((prev) => prev + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const handleSubmit = () => {
    let allValid = true
    const allErrors: { [key: string]: string } = {}

    visibleQuestions.forEach((question) => {
      if (question.display === 'required') {
        const answer = answers[question.id]
        if (
          !answer ||
          (typeof answer.value === 'string' && !answer.value.trim()) ||
          (Array.isArray(answer.value) && answer.value.length === 0) ||
          answer.value === undefined
        ) {
          allErrors[question.id] = formatMessage(m.requiredQuestion)
          allValid = false
        }
      }
    })

    if (allValid) {
      onSubmit(answers)
    } else {
      setErrors(allErrors)
    }
  }

  const currentQuestions = questionSteps[currentStep] || []
  const isLastStep = currentStep === questionSteps.length - 1
  const canGoNext = currentStep < questionSteps.length - 1
  const canGoPrevious = currentStep > 0

  return (
    <Stack space={6}>
      {/* Header */}
      <Box>
        <Text variant="h2" marginBottom={2}>
          {questionnaire.title}
        </Text>
        <Text variant="intro">
          {questionnaire.description.split('\\n').map((line, index) => (
            <React.Fragment key={index}>
              <Text>{line}</Text>
              {index < questionnaire.description.split('\\n').length - 1 && (
                <br />
              )}
            </React.Fragment>
          ))}
        </Text>
      </Box>

      {/* Stepper (if enabled and multiple steps) */}
      {/* TODO: Move to sidenav */}
      {enableStepper && questionSteps.length > 1 && (
        <Stepper
          steps={steps}
          currentStepIndex={currentStep}
          onStepChange={handleStepChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          nextLabel={isLastStep ? 'Review' : 'Next'}
          previousLabel="Back"
          showProgress={true}
          orientation="horizontal"
          allowClickableSteps={false}
        />
      )}

      {/* Questions */}
      <Box style={{ minHeight: '400px' }}>
        <Stack space={4}>
          {currentQuestions.map((question) => (
            <QuestionRenderer
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onAnswerChange={handleAnswerChange}
              error={errors[question.id]}
            />
          ))}
        </Stack>
      </Box>

      {/* Navigation/Submit buttons */}
      <Box display="flex" justifyContent="spaceBetween" alignItems="center">
        <Box>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
        </Box>

        <Box display="flex" alignItems="center">
          {enableStepper && questionSteps.length > 1 ? (
            <>
              {canGoPrevious && (
                <Box marginRight={2}>
                  <Button variant="ghost" onClick={handlePrevious}>
                    {formatMessage(m.lastQuestion)}
                  </Button>
                </Box>
              )}
              {canGoNext ? (
                <Button variant="primary" onClick={handleNext}>
                  {formatMessage(m.nextQuestion)}
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubmit}>
                  {submitLabel}
                </Button>
              )}
            </>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              {submitLabel}
            </Button>
          )}
        </Box>
      </Box>
    </Stack>
  )
}

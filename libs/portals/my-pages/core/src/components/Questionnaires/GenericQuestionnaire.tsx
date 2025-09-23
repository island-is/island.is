import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Box, Text, Stack, Button } from '@island.is/island-ui/core'
import { QuestionRenderer } from '../Questionnaires/QuestionRenderer'
import { Stepper, Step } from '../Questionnaires/Stepper'
import { isQuestionVisible } from './utils/visibilityUtils'

import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { QuestionAnswer } from '../../types/questionnaire'
import { Question, Questionnaire } from '@island.is/api/schema'

interface GenericQuestionnaireProps {
  questionnaire: Questionnaire
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
    return questionnaire.questions?.filter((question: Question) =>
      isQuestionVisible(
        question.id,
        question.dependsOn ?? undefined,
        question.visibilityCondition ?? undefined,
        answers,
      ),
    )
  }, [questionnaire.questions, answers])

  // Split questions into steps if stepper is enabled
  const questionSteps = useMemo(() => {
    return enableStepper
      ? visibleQuestions?.reduce(
          (steps: Question[][], question: Question, index: number) => {
            const stepIndex = Math.floor(index / questionsPerStep)
            if (!steps[stepIndex]) {
              steps[stepIndex] = []
            }
            steps[stepIndex].push(question)
            return steps
          },
          [],
        )
      : [visibleQuestions as Question[]]
  }, [visibleQuestions, enableStepper, questionsPerStep])

  useEffect(() => {
    if (questionSteps && questionSteps.length > 0) {
      setCurrentStep((prevStep) =>
        Math.max(0, Math.min(prevStep, questionSteps.length - 1)),
      )
    }
  }, [questionSteps])

  // Create stepper steps
  const steps: Step[] | undefined = questionSteps?.map(
    (_: Question[], index: number) => ({
      id: `step-${index}`,
      title: `Step ${index + 1}`,
      description: `Questions ${index * questionsPerStep + 1}-${Math.min(
        (index + 1) * questionsPerStep,
        visibleQuestions?.length ?? 0,
      )}`,
      completed: false,
    }),
  )

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
    const currentQuestions = questionSteps
      ? questionSteps[currentStep] || []
      : []
    const newErrors: { [key: string]: string } = {}
    let isValid = true

    currentQuestions.forEach((question: Question) => {
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
      if (questionSteps && currentStep < questionSteps.length - 1) {
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

    visibleQuestions?.forEach((question: Question) => {
      if (question.display === 'required') {
        const answer = answers[question.id]
        if (
          !answer ||
          (typeof answer.value === 'string' && !answer.value.trim()) ||
          (Array.isArray(answer.value) && answer.value.length === 0) ||
          answer.value === undefined
        ) {
          allErrors[question.id] =
            formatMessage(m.requiredQuestion) ?? 'This field is required'
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

  const currentQuestions = questionSteps?.[currentStep] || []
  const isLastStep = currentStep === (questionSteps?.length || 1) - 1
  const canGoNext = currentStep < (questionSteps?.length || 1) - 1
  const canGoPrevious = currentStep > 0

  return (
    <Stack space={6}>
      {/* Header */}
      <Box>
        <Text variant="h2" marginBottom={2}>
          {questionnaire.title}
        </Text>
        <Text variant="intro">
          {questionnaire.description
            ?.split('\\n')
            .map((line: string, index: number) => (
              <React.Fragment key={index}>
                <Text>{line}</Text>
                {index <
                  (questionnaire.description?.split('\\n').length ?? 0) - 1 && (
                  <br />
                )}
              </React.Fragment>
            ))}
        </Text>
      </Box>

      {/* Stepper (if enabled and multiple steps) */}
      {/* TODO: Move to sidenav */}
      {enableStepper && questionSteps && questionSteps.length > 1 && (
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
          {currentQuestions.map((question: Question) => (
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
          {enableStepper && questionSteps && questionSteps.length > 1 ? (
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

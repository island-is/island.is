import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { QuestionRenderer } from '../Questionnaires/QuestionRenderer'
import { Stepper } from '../Questionnaires/Stepper'
import { isQuestionVisible } from './utils/visibilityUtils'

import { Question, Questionnaire } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { QuestionAnswer } from '../../types/questionnaire'

interface GenericQuestionnaireProps {
  questionnaire: Questionnaire
  onSubmit: (answers: { [key: string]: QuestionAnswer }) => void
  onCancel?: () => void
  backLink?: string
  enableStepper?: boolean
  questionsPerStep?: number
  submitLabel?: string
  cancelLabel?: string
  img?: string
}

export const GenericQuestionnaire: React.FC<GenericQuestionnaireProps> = ({
  questionnaire,
  onSubmit,
  onCancel: _onCancel,
  enableStepper = false,
  questionsPerStep: _questionsPerStep = 3,
  submitLabel = 'Staðfesta',
  cancelLabel: _cancelLabel = 'Hætta við',
  backLink,
  img,
}) => {
  const { formatMessage } = useLocale()
  const [answers, setAnswers] = useState<{ [key: string]: QuestionAnswer }>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Process sections into visible questions with section-aware filtering
  const processedSections = useMemo(() => {
    if (!questionnaire.sections?.length) return []

    return questionnaire.sections
      .map((section) => {
        if (!section.questions?.length) return { ...section, questions: [] }

        const filteredQuestions = section.questions.filter((question) => {
          if (!question.answerOptions?.type) return false

          return isQuestionVisible(
            question.id,
            question.dependsOn || undefined,
            question.visibilityCondition || undefined,
            answers,
          )
        })

        return { ...section, questions: filteredQuestions }
      })
      .filter((section) => section.questions?.length > 0)
  }, [questionnaire.sections, answers])

  // Get all visible questions for backwards compatibility
  const visibleQuestions = useMemo(() => {
    return processedSections.flatMap((section) => section.questions || [])
  }, [processedSections])

  // Create stepper steps from sections if stepper is enabled
  const questionSteps = useMemo(() => {
    if (enableStepper && processedSections.length > 1) {
      return processedSections.map((section) => section.questions || [])
    }
    return [visibleQuestions]
  }, [enableStepper, processedSections, visibleQuestions])

  // Create stepper steps
  const stepperSteps = useMemo(() => {
    if (!enableStepper || !questionSteps || questionSteps.length <= 1) {
      return undefined
    }

    return questionSteps.map((_, index) => ({
      id: `step-${index}`,
      title: processedSections[index]?.sectionTitle || `Step ${index + 1}`,
      completed: index < currentStep,
      disabled: false,
    }))
  }, [enableStepper, questionSteps, currentStep, processedSections])

  useEffect(() => {
    if (questionSteps && questionSteps.length > 0) {
      setCurrentStep((prevStep) =>
        Math.max(0, Math.min(prevStep, questionSteps.length - 1)),
      )
    }
  }, [questionSteps])

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
    <Box display="flex" flexDirection="row" background="blue100">
      {/* Header */}
      {/* Stepper (if enabled and multiple steps) */}
      {/* TODO: Move to sidenav */}
      {enableStepper && questionSteps && questionSteps.length > 1 && (
        <Box
          background={'blue100'}
          padding={3}
          marginRight={4}
          style={{ minWidth: '312px', maxWidth: '400px' }}
        >
          <Stepper
            steps={stepperSteps}
            currentStepIndex={currentStep}
            onStepChange={handleStepChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            nextLabel={isLastStep ? 'Review' : 'Next'}
            previousLabel="Back"
            allowClickableSteps={false}
            backLink={backLink}
          />
        </Box>
      )}

      <Box background="white" borderRadius="standard">
        <Box
          borderBottomWidth="standard"
          borderColor="blue200"
          padding={3}
          display="flex"
          flexDirection="row"
          columnGap={3}
        >
          {img && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              background={'blue100'}
              borderRadius="full"
              padding={1}
              style={{ maxWidth: 48, maxHeight: 48 }}
            >
              <img src={img} alt="" style={{ height: '100%' }} />
            </Box>
          )}
          <Box display={'flex'} flexDirection={'column'}>
            <Text variant="small">{formatMessage(m.questionnaires)}</Text>
            <Text variant="h5" as="h1" marginBottom={2}>
              {questionnaire.title}
            </Text>
          </Box>
          {/* <Text variant="intro">
            {questionnaire.description
              ?.split('\\n')
              .map((line: string, index: number) => (
                <React.Fragment key={index}>
                  <Text>{line}</Text>
                  {index <
                    (questionnaire.description?.split('\\n').length ?? 0) -
                      1 && <br />}
                </React.Fragment>
              ))}
          </Text> */}
        </Box>

        {/* Questions */}
        <Box style={{ minHeight: '400px' }} marginX={10} marginY={6}>
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
        {enableStepper && questionSteps && questionSteps.length > 1 ? (
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            paddingX={10}
            paddingBottom={4}
          >
            <Box>
              {canGoPrevious && (
                <Button variant="ghost" onClick={handlePrevious}>
                  Go back
                </Button>
              )}
            </Box>
            <Box>
              {canGoNext ? (
                <Button variant="primary" onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubmit}>
                  {submitLabel}
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          <Box display="flex" justifyContent="flexEnd">
            <Button variant="primary" onClick={handleSubmit}>
              {submitLabel}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

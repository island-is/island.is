import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { QuestionRenderer } from '../Questionnaires/QuestionRenderer'
import { Stepper } from '../Questionnaires/Stepper'
import {
  isQuestionVisibleWithStructuredConditions,
  isSectionVisible,
} from './utils/visibilityUtils'

import {
  Questionnaire,
  QuestionnaireAnswerOptionType,
  QuestionnaireQuestion,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { QuestionAnswer } from '../../types/questionnaire'
import { calculateFormula } from './utils/calculations'

interface GenericQuestionnaireProps {
  questionnaire: Questionnaire
  onSubmit: (answers: { [key: string]: QuestionAnswer }) => void
  onCancel?: () => void
  backLink?: string
  enableStepper?: boolean
  questionsPerStep?: number
  img?: string
  initialAnswers?: { [key: string]: QuestionAnswer }
  isDraft?: boolean
}

export const GenericQuestionnaire: React.FC<GenericQuestionnaireProps> = ({
  questionnaire,
  onSubmit,
  onCancel: _onCancel,
  enableStepper = false,
  questionsPerStep: _questionsPerStep = 3,
  backLink,
  img,
  initialAnswers,
  isDraft: _isDraft = false,
}) => {
  const { formatMessage } = useLocale()
  const [answers, setAnswers] = useState<{ [key: string]: QuestionAnswer }>(
    initialAnswers || {},
  )

  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Helper function to calculate formula
  const calculateFormulaCallback = useCallback(
    (
      formula: string,
      answers: { [key: string]: QuestionAnswer },
    ): number | null => {
      return calculateFormula(formula, answers)
    },
    [],
  )

  // Initialize calculated values when component mounts
  useEffect(() => {
    if (!questionnaire.sections?.length) return

    const allQuestions = questionnaire.sections.flatMap(
      (s) => s.questions || [],
    )
    const calculatedAnswers: { [key: string]: QuestionAnswer } = {}

    // Find questions with formulas and calculate their initial values
    for (const question of allQuestions) {
      const extendedAnswerOptions = question.answerOptions
      if (extendedAnswerOptions?.formula) {
        const calculatedValue = calculateFormulaCallback(
          extendedAnswerOptions.formula,
          initialAnswers || {},
        )
        calculatedAnswers[question.id] = {
          questionId: question.id,
          answers: [
            {
              value: calculatedValue?.toString() || '',
            },
          ],
          type: question.answerOptions.type,
        }
      }
    }

    // Set initial calculated answers only if we don't have initial answers already
    if (Object.keys(calculatedAnswers).length > 0 && !initialAnswers) {
      setAnswers(calculatedAnswers)
    }
  }, [questionnaire.sections, calculateFormulaCallback, initialAnswers])

  // Process sections into visible questions with section-aware filtering
  const processedSections = useMemo(() => {
    if (!questionnaire.sections?.length) return []

    return questionnaire.sections
      .filter((section) => {
        // First check if the section itself is visible based on its conditions
        return isSectionVisible(section, answers)
      })
      .map((section) => {
        if (!section.questions?.length) return { ...section, questions: [] }

        const filteredQuestions = section.questions.filter((question) => {
          if (!question.answerOptions?.type) return false

          if (
            question.visibilityConditions &&
            question.visibilityConditions.length > 0
          ) {
            return isQuestionVisibleWithStructuredConditions(
              question.visibilityConditions,
              answers,
            )
          }

          // Questions without visibility conditions are visible by default
          return true
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
    if (enableStepper) {
      return processedSections.map((section) => section.questions || [])
    }
    return [visibleQuestions]
  }, [enableStepper, processedSections, visibleQuestions])

  // Create stepper steps
  const stepperSteps = useMemo(() => {
    if (!enableStepper || !questionSteps) {
      return undefined
    }

    return questionSteps.map((_, index) => ({
      id: `step-${index}`,
      title: processedSections[index]?.title || `Step ${index + 1}`,
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

  // Clear answers for hidden questions
  useEffect(() => {
    if (!questionnaire.sections?.length) return

    const visibleQuestionIds = new Set(
      processedSections.flatMap(
        (section) => section.questions?.map((q) => q.id) || [],
      ),
    )

    // Find answers for questions that are no longer visible
    const hiddenQuestionIds = Object.keys(answers).filter(
      (questionId) => !visibleQuestionIds.has(questionId),
    )

    if (hiddenQuestionIds.length > 0) {
      setAnswers((prev) => {
        const newAnswers = { ...prev }
        hiddenQuestionIds.forEach((questionId) => {
          delete newAnswers[questionId]
        })
        return newAnswers
      })
    }
  }, [processedSections, answers, questionnaire.sections])

  const handleAnswerChange = useCallback(
    (answer: QuestionAnswer) => {
      setAnswers((prev) => {
        const newAnswers = {
          ...prev,
          [answer.questionId]: answer,
        }

        // Calculate any formulas that depend on changed values
        const allQuestions =
          questionnaire.sections?.flatMap((s) => s.questions || []) || []

        for (const question of allQuestions) {
          const extendedAnswerOptions = question.answerOptions
          if (extendedAnswerOptions?.formula) {
            const calculatedValue = calculateFormulaCallback(
              extendedAnswerOptions.formula,
              newAnswers,
            )
            newAnswers[question.id] = {
              questionId: question.id,
              answers: [
                {
                  value: String(calculatedValue ?? ''),
                },
              ],
              type: question.answerOptions.type,
            }
          }
        }

        return newAnswers
      })

      setErrors((prev) => {
        const { [answer.questionId]: _, ...newErrors } = prev
        return newErrors
      })
    },
    [questionnaire.sections, calculateFormulaCallback],
  )

  const validateCurrentStep = (): boolean => {
    const currentQuestions = questionSteps
      ? questionSteps[currentStep] || []
      : []
    const newErrors: { [key: string]: string } = {}
    let isValid = true

    currentQuestions.forEach((question: QuestionnaireQuestion) => {
      const answer = answers[question.id]
      if (
        question.answerOptions.type === QuestionnaireAnswerOptionType.label ||
        !question.required
      )
        return

      const isEmpty =
        !answer ||
        !answer.answers ||
        answer.answers.length === 0 ||
        answer.answers.every((a) => !a.value || a.value.trim() === '')

      if (question.required && isEmpty) {
        newErrors[question.id] = formatMessage(m.requiredQuestion)
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (questionSteps && currentStep < questionSteps.length - 1) {
        setCurrentStep((prev) => prev + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const handleSubmit = () => {
    let allValid = true
    const allErrors: { [key: string]: string } = {}

    visibleQuestions?.forEach((question: QuestionnaireQuestion) => {
      const answer = answers[question.id]
      if (
        question.answerOptions.type === QuestionnaireAnswerOptionType.label ||
        !question.required
      )
        return

      const isEmpty =
        !answer ||
        !answer.answers ||
        answer.answers.length === 0 ||
        answer.answers.every((a) => !a.value || a.value.trim() === '')

      if (question.required && isEmpty) {
        allErrors[question.id] = formatMessage(m.requiredQuestion)
        allValid = false
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
    <Box marginTop={enableStepper ? [8, 8, 8, 4] : 0}>
      {/* Header */}
      {/* Stepper (if enabled and multiple steps) */}
      <GridContainer>
        <GridRow>
          {enableStepper && questionSteps && (
            <GridColumn span={['12/12', '12/12', '3/12']}>
              <Box
                background={enableStepper ? 'blue100' : 'white'}
                paddingBottom={3}
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
            </GridColumn>
          )}

          <GridColumn
            span={enableStepper ? ['12/12', '12/12', '9/12'] : '12/12'}
          >
            <Box background="white" borderRadius="standard">
              <Box
                borderBottomWidth="standard"
                borderColor="blue200"
                padding={[0, 0, 0, 3]}
                display="flex"
                flexDirection="row"
                columnGap={3}
              >
                {img && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    background={enableStepper ? 'blue100' : 'white'}
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
                    {questionnaire.baseInformation.title}
                  </Text>
                </Box>
              </Box>

              {/* Questions */}
              <Box
                style={{ minHeight: '400px' }}
                marginX={enableStepper ? 10 : [0, 0, 0, 4]}
                marginY={[2, 2, 2, 6]}
              >
                {enableStepper ? (
                  <Stack space={4}>
                    {currentQuestions.map((question: QuestionnaireQuestion) => (
                      <QuestionRenderer
                        key={question.id}
                        question={question}
                        answer={answers[question.id]}
                        onAnswerChange={handleAnswerChange}
                        error={errors[question.id]}
                        disabled={question.answerOptions.formula ? true : false}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Stack space={6}>
                    {processedSections.map((section, sectionIndex) => (
                      <Box key={`section-${sectionIndex}`}>
                        {section.title && (
                          <Box marginBottom={3}>
                            <Text
                              variant="h4"
                              as="h2"
                              aria-describedby={
                                section.description
                                  ? `section-desc-${sectionIndex}`
                                  : undefined
                              }
                            >
                              {section.title}
                            </Text>
                            {section.description && (
                              <Text
                                marginTop={1}
                                id={`section-desc-${sectionIndex}`}
                              >
                                {section.description}
                              </Text>
                            )}
                          </Box>
                        )}
                        <Stack space={4}>
                          {section.questions?.map(
                            (question: QuestionnaireQuestion) => (
                              <QuestionRenderer
                                key={question.id}
                                question={question}
                                answer={answers[question.id]}
                                onAnswerChange={handleAnswerChange}
                                error={errors[question.id]}
                                disabled={
                                  question.answerOptions.formula ? true : false
                                }
                              />
                            ),
                          )}
                        </Stack>
                        <Box paddingBottom={3} paddingTop={6}>
                          <Divider />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              {/* Navigation/Submit buttons */}
              {enableStepper && questionSteps ? (
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
                        {formatMessage(m.lastQuestion)}
                      </Button>
                    )}
                  </Box>
                  <Box>
                    {canGoNext ? (
                      <Button variant="primary" onClick={handleNext}>
                        {formatMessage(m.nextQuestion)}
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={handleSubmit}>
                        {formatMessage(m.submit)}
                      </Button>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  paddingX={[0, 0, 0, enableStepper ? 10 : 3]}
                  paddingY={2}
                  paddingBottom={4}
                >
                  <Box>
                    <Button variant="ghost" onClick={_onCancel}>
                      {formatMessage(m.buttonCancel)}
                    </Button>
                  </Box>
                  <Box>
                    <Button variant="primary" onClick={handleSubmit}>
                      {formatMessage(m.submit)}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

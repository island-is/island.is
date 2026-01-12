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
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { QuestionRenderer } from '../Questionnaires/QuestionRenderer'
import {
  isQuestionVisibleWithStructuredConditions,
  isSectionVisible,
} from './utils/visibilityUtils'

import {
  Questionnaire,
  QuestionnaireAnswerOptionType,
  QuestionnaireQuestion,
  QuestionnaireQuestionnairesOrganizationEnum,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { QuestionAnswer } from '../../types/questionnaire'
import { QuestionnaireFooter } from './Footer'
import { QuestionnaireHeader } from './Header'
import { Review } from './Review'
import { calculateFormula } from './utils/calculations'

interface GenericQuestionnaireProps {
  questionnaire: Questionnaire
  onSubmit: (
    answers: { [key: string]: QuestionAnswer },
    asDraft?: boolean,
  ) => void
  onCancel?: () => void
  img?: string
  initialAnswers?: { [key: string]: QuestionAnswer }
  submitting?: boolean
}

export const GenericQuestionnaire: FC<GenericQuestionnaireProps> = ({
  questionnaire,
  onSubmit,
  onCancel,
  img,
  initialAnswers,
  submitting = false,
}) => {
  const { formatMessage } = useLocale()
  const [answers, setAnswers] = useState<{ [key: string]: QuestionAnswer }>(
    initialAnswers || {},
  )

  const [showReview, setShowReview] = useState(false)
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
      (s) => s.questions ?? [],
    )
    const calculatedAnswers: { [key: string]: QuestionAnswer } = {}

    // Find questions with formulas and calculate their initial values
    for (const question of allQuestions) {
      const extendedAnswerOptions = question.answerOptions
      if (extendedAnswerOptions?.formula) {
        const calculatedValue = calculateFormulaCallback(
          extendedAnswerOptions.formula,
          initialAnswers ?? {},
        )
        calculatedAnswers[question.id] = {
          questionId: question.id,
          question: question.label,
          answers: [
            {
              value: calculatedValue?.toString() ?? '',
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
    return processedSections.flatMap((section) => section.questions ?? [])
  }, [processedSections])

  // Clear answers for hidden questions
  useEffect(() => {
    if (!questionnaire.sections?.length) return

    const visibleQuestionIds = new Set(
      processedSections.flatMap(
        (section) => section.questions?.map((q) => q.id) ?? [],
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
          questionnaire.sections?.flatMap((s) => s.questions ?? []) ?? []

        for (const question of allQuestions) {
          const extendedAnswerOptions = question.answerOptions
          if (extendedAnswerOptions?.formula) {
            const calculatedValue = calculateFormulaCallback(
              extendedAnswerOptions.formula,
              newAnswers,
            )
            newAnswers[question.id] = {
              questionId: question.id,
              question: question.label,
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

  const handleSubmit = (asDraft?: boolean) => {
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
      if (asDraft) {
        onSubmit(answers, true)
      } else {
        if (showReview) {
          onSubmit(answers, false)
        } else {
          setShowReview(true)
        }
      }
    } else {
      setErrors(allErrors)
    }
  }

  return (
    <Box marginTop={0}>
      {/* Header */}
      {/* Stepper (if enabled and multiple steps) */}
      <GridContainer>
        <GridRow>
          <GridColumn span={'12/12'}>
            <Box background="white" borderRadius="standard">
              <QuestionnaireHeader
                title={questionnaire.baseInformation.title}
                img={img}
                buttonGroup={
                  questionnaire.baseInformation.organization ===
                  QuestionnaireQuestionnairesOrganizationEnum.EL
                    ? [
                        <Button
                          variant="utility"
                          icon="save"
                          iconType="outline"
                          key="save-draft"
                          onClick={() => handleSubmit(true)}
                        >
                          {formatMessage(m.saveAsDraft)}
                        </Button>,
                      ]
                    : undefined
                }
              />
              {/* Questions */}
              <Box style={{ minHeight: '400px' }} marginY={[2, 2, 2, 6]}>
                {showReview ? (
                  <Review
                    answers={answers}
                    title={formatMessage(m.reviewTitle)}
                  />
                ) : (
                  <Stack space={4}>
                    {processedSections.map((section, sectionIndex) => (
                      <Box key={`section-${sectionIndex}`}>
                        {section.title && (
                          <Box marginBottom={3}>
                            <Text
                              variant="h3"
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
              <QuestionnaireFooter
                onSubmit={() => handleSubmit(false)}
                onCancel={showReview ? () => setShowReview(false) : onCancel}
                submitting={submitting}
                submitLabel={
                  showReview
                    ? formatMessage(m.sendAnswers)
                    : formatMessage(m.forward)
                }
                cancelLabel={
                  showReview
                    ? formatMessage(m.buttonEdit)
                    : formatMessage(m.buttonCancel)
                }
                submitDisabled={showReview && Object.keys(answers).length === 0}
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

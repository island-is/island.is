import { useMutation } from '@apollo/client'
import {
  formatTextWithLocale,
  getErrorViaPath,
} from '@island.is/application/core'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RadioController } from '@island.is/shared/form-fields'
import { Locale } from '@island.is/shared/types'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { SelfAssessmentQuestionnaireAnswers } from '../../types'
import { selfAssessmentOptions } from '../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../utils/medicalAndRehabilitationPaymentsUtils'

export const SelfAssessmentQuestionnaire: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
  setSubmitButtonDisabled,
}) => {
  const { setValue, trigger } = useFormContext()
  const { formatMessage, lang: locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const { selfAssessmentQuestionnaire } = getApplicationExternalData(
    application.externalData,
  )
  const { questionnaire } = getApplicationAnswers(application.answers)

  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [questionnaireAnswers, setQuestionnaireAnswers] =
    useState<SelfAssessmentQuestionnaireAnswers[]>(questionnaire)

  const selfAssessmentQuestionnaireQuestions =
    selfAssessmentQuestionnaire.find(
      (questionnaire) => questionnaire.language.toLowerCase() === locale,
    )?.questions ??
    selfAssessmentQuestionnaire.find(
      (questionnaire) => questionnaire.language.toLowerCase() === 'is',
    )?.questions ??
    []

  useEffect(() => {
    // Disable next button until finished answering the questionnaire
    if (
      questionnaireAnswers.length ===
      selfAssessmentQuestionnaireQuestions.length
    ) {
      setSubmitButtonDisabled && setSubmitButtonDisabled(false)
    } else {
      setSubmitButtonDisabled && setSubmitButtonDisabled(true)
    }
  }, [
    questionnaireAnswers.length,
    selfAssessmentQuestionnaireQuestions.length,
    setSubmitButtonDisabled,
  ])

  const onUpdateApplication = async () => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            selfAssessment: {
              questionnaire: questionnaireAnswers,
            },
          },
        },
        locale,
      },
    })
  }

  const isLastQuestion =
    currentIndex === selfAssessmentQuestionnaireQuestions.length - 1
  const showPreviousQuestionButton = currentIndex >= 1

  const goToPreviousQuestion = (index: number) => {
    setCurrentIndex(index - 1)
  }

  const goToNextQuestion = async (index: number) => {
    const isValid = await trigger(`${field.id}[${index}].answer`)

    if (isValid) {
      setCurrentIndex(index + 1)
      onUpdateApplication()
    }
  }

  const onChange = (value: string) => {
    setValue(
      `${field.id}[${currentIndex}].questionId`,
      selfAssessmentQuestionnaireQuestions[currentIndex].questionCode,
    )

    const values = {
      answer: value,
      questionId:
        selfAssessmentQuestionnaireQuestions[currentIndex].questionCode,
    }

    const questionnaireIndex = questionnaireAnswers.findIndex(
      (answer) => answer.questionId === values.questionId,
    )

    let updatedQuestionnaireAnswers: SelfAssessmentQuestionnaireAnswers[] = []
    if (questionnaireIndex !== -1) {
      // Update value
      updatedQuestionnaireAnswers = [...questionnaireAnswers]
      updatedQuestionnaireAnswers[questionnaireIndex] = values
    } else {
      // Insert value
      updatedQuestionnaireAnswers = [...questionnaireAnswers, values]
    }

    setQuestionnaireAnswers(updatedQuestionnaireAnswers)
  }

  return (
    <Box
      padding={4}
      background="blue100"
      borderRadius="large"
      borderColor="blue200"
      border="standard"
    >
      {/* Header */}
      <Box display="flex" flexDirection="column" marginBottom={4}>
        <Box display="flex" alignItems="center" justifyContent="spaceBetween">
          <Text variant="h3" as="h3">
            {selfAssessmentQuestionnaireQuestions[currentIndex].questionTitle}
          </Text>
          <Text variant="eyebrow" color="purple400">
            {formatTextWithLocale(
              {
                ...medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                  .questionNumber,
                values: {
                  index: currentIndex + 1,
                  total: selfAssessmentQuestionnaireQuestions.length,
                },
              },
              application,
              locale as Locale,
              formatMessage,
            )}
          </Text>
        </Box>
        <Text marginTop={1}>
          {selfAssessmentQuestionnaireQuestions[currentIndex].question}
        </Text>
      </Box>

      {/* Body */}
      <RadioController
        key={`${field.id}[${currentIndex}].answer`}
        id={`${field.id}[${currentIndex}].answer`}
        error={
          errors &&
          getErrorViaPath(errors, `${field.id}[${currentIndex}].answer`)
        }
        largeButtons
        options={selfAssessmentOptions.map((option) => ({
          value: option.value,
          label: formatMessage(option.label),
        }))}
        backgroundColor="white"
        onSelect={(value) => onChange(value)}
      />

      {/* Footer */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        marginTop={3}
      >
        <Box display="inlineFlex">
          {showPreviousQuestionButton && (
            <Button
              variant="text"
              preTextIcon="arrowBack"
              onClick={() => goToPreviousQuestion(currentIndex)}
            >
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                  .previousQuestion,
              )}
            </Button>
          )}
        </Box>
        <Box display="inlineFlex">
          {!isLastQuestion && (
            <Button
              variant="text"
              icon="arrowForward"
              onClick={() => goToNextQuestion(currentIndex)}
            >
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                  .nextQuestion,
              )}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

import { FC, useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Divider,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'
import { assessmentOptions } from '../utils/options'
import {
  answerKey,
  getAssessmentAnswers,
  getQuestionsData,
  groupQuestionsByCategory,
  isQuestionAnswered,
} from '../utils/assessment'
import { ASSESSMENT_CONFIRMATION_ID } from '../utils/constants'
import { setFocusQuestionId } from '../utils/focusQuestion'

// The screen id (buildMultiField id) of the assessment step to jump back to.
const ASSESSMENT_SCREEN_ID = 'assessment'

// A category is "done" only when every question is fully answered (both the
// answer and the remark), "in progress" when at least one question has been
// started (a radio option selected, even if the remark is still missing), and
// "not started" when nothing has been touched.
const getCategoryStatus = (
  answered: number,
  started: number,
  total: number,
) => {
  if (total > 0 && answered === total) return 'done' as const
  if (started > 0) return 'inProgress' as const
  return 'notStarted' as const
}

const STATUS_CONFIG = {
  done: { label: m.overview.statusDone, variant: 'mint' as const },
  inProgress: {
    label: m.overview.statusInProgress,
    variant: 'yellow' as const,
  },
  notStarted: { label: m.overview.statusNotStarted, variant: 'red' as const },
}

export const AssessmentOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()
  const { control } = useFormContext()

  // Ids of the categories whose accordion item is currently open.
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])

  // Set once the applicant tries to submit while something is still missing, so
  // the error only appears after they act on the button, not before.
  const [showError, setShowError] = useState(false)

  // Stash the target question, then navigate to the assessment screen, which
  // reads the target and scrolls to / expands that question.
  const editQuestion = (questionId: number) => {
    setFocusQuestionId(questionId)
    goToScreen?.(ASSESSMENT_SCREEN_ID)
  }

  const questionsData = getQuestionsData(application.externalData)
  const answers = getAssessmentAnswers(application.answers)

  // Map an answer value to its localized label once, for the "Svar" column.
  const answerLabels = useMemo(
    () =>
      new Map(
        assessmentOptions.map(
          (option) => [option.value, formatMessage(option.label)] as const,
        ),
      ),
    [formatMessage],
  )

  // Live value of the confirmation checkbox so submit validation reacts to it.
  const confirmed = useWatch({
    control,
    name: ASSESSMENT_CONFIRMATION_ID,
    defaultValue: Boolean(application.answers?.[ASSESSMENT_CONFIRMATION_ID]),
  }) as boolean

  // Every question must be fully answered (both the answer and the remark).
  const allQuestions = questionsData?.questions ?? []
  const allAnswered =
    allQuestions.length > 0 &&
    allQuestions.every((q) => isQuestionAnswered(answers?.[answerKey(q.id)]))

  // The submit button stays clickable, but submitting is blocked with an error
  // until every question is fully answered and the confirmation is ticked.
  const canSubmit = allAnswered && confirmed
  useEffect(() => {
    if (!setBeforeSubmitCallback) return

    setBeforeSubmitCallback(async () => {
      if (!canSubmit) {
        setShowError(true)
        return [false, formatMessage(m.overview.incompleteHint)]
      }
      return [true, null]
    })
  }, [setBeforeSubmitCallback, canSubmit, formatMessage])

  if (!questionsData || questionsData.questions.length === 0) {
    return null
  }

  const groups = groupQuestionsByCategory(questionsData)

  // Categories that still have at least one unanswered question, each paired with
  // its first unanswered question so the "go to category" button can jump there.
  const incompleteGroups = groups.flatMap(({ category, questions }) => {
    const firstUnanswered = questions.find(
      (q) => !isQuestionAnswered(answers?.[answerKey(q.id)]),
    )
    return firstUnanswered ? [{ category, firstUnanswered }] : []
  })

  const allOpen =
    groups.length > 0 &&
    groups.every(({ category }) => expandedCategories.includes(category.id))

  const toggleAll = () =>
    setExpandedCategories(
      allOpen ? [] : groups.map(({ category }) => category.id),
    )

  return (
    <Box>
      <Box display="flex" justifyContent="flexEnd" marginBottom={2}>
        <Button
          variant="utility"
          size="small"
          icon={allOpen ? 'remove' : 'add'}
          onClick={toggleAll}
        >
          {formatMessage(allOpen ? m.overview.closeAll : m.overview.openAll)}
        </Button>
      </Box>
      <Accordion
        singleExpand={false}
        dividerOnBottom={false}
        dividerOnTop={false}
      >
        {groups.map(({ category, questions }) => {
          const answered = questions.filter((q) =>
            isQuestionAnswered(answers?.[answerKey(q.id)]),
          ).length
          const started = questions.filter(
            (q) => answers?.[answerKey(q.id)]?.answerValue,
          ).length
          const status = getCategoryStatus(answered, started, questions.length)
          const { label: statusLabel, variant } = STATUS_CONFIG[status]

          return (
            <AccordionItem
              key={category.id}
              id={`overview-category-${category.id}`}
              label={category.label}
              labelVariant="h4"
              expanded={expandedCategories.includes(category.id)}
              onToggle={(value) =>
                setExpandedCategories((prev) =>
                  value
                    ? [...prev, category.id]
                    : prev.filter((id) => id !== category.id),
                )
              }
              statusPill={
                <Tag variant={variant}>{formatMessage(statusLabel)}</Tag>
              }
            >
              <T.Table>
                <T.Head>
                  <T.Row>
                    <T.HeadData width="5%"></T.HeadData>
                    <T.HeadData width="40%">
                      {formatMessage(m.overview.columnQuestion)}
                    </T.HeadData>
                    <T.HeadData width="30%">
                      {formatMessage(m.overview.columnRemark)}
                    </T.HeadData>
                    <T.HeadData>
                      {formatMessage(m.overview.columnAnswer)}
                    </T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {questions.map((question) => {
                    const stored = answers?.[answerKey(question.id)]
                    const answerLabel = stored?.answerValue
                      ? answerLabels.get(stored.answerValue)
                      : undefined

                    return (
                      <T.Row key={question.id}>
                        <T.Data>
                          <Button
                            variant="text"
                            size="medium"
                            icon="pencil"
                            iconType="outline"
                            onClick={() => editQuestion(question.id)}
                            title={formatMessage(m.overview.editQuestion)}
                          />
                        </T.Data>
                        <T.Data>{question.questionText}</T.Data>
                        <T.Data>
                          {!stored?.remark && answerLabel ? (
                            <Text variant="small" color="red600">
                              {formatMessage(m.overview.missingDescription)}
                            </Text>
                          ) : (
                            stored?.remark || '-'
                          )}
                        </T.Data>
                        <T.Data>
                          {answerLabel ?? (
                            <Text variant="small" color="red600">
                              {formatMessage(m.overview.notAnswered)}
                            </Text>
                          )}
                        </T.Data>
                      </T.Row>
                    )
                  })}
                </T.Body>
              </T.Table>
            </AccordionItem>
          )
        })}
      </Accordion>

      <Box marginTop={4}>
        <Controller
          name={ASSESSMENT_CONFIRMATION_ID}
          control={control}
          defaultValue={confirmed}
          render={({ field: { value, onChange } }) => (
            <Checkbox
              id={ASSESSMENT_CONFIRMATION_ID}
              name={ASSESSMENT_CONFIRMATION_ID}
              large
              label={formatMessage(m.overview.confirmation)}
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
            />
          )}
        />
      </Box>

      {showError && !canSubmit && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(m.overview.errorTitle)}
            message={
              !allAnswered ? (
                <Box width="full">
                  <Text marginBottom={2}>
                    {formatMessage(m.overview.incompleteHint)}
                  </Text>
                  {incompleteGroups.map(
                    ({ category, firstUnanswered }, index) => (
                      <Box key={category.id}>
                        <Box
                          display="flex"
                          flexDirection={['column', 'row']}
                          alignItems={['flexStart', 'center']}
                          justifyContent="spaceBetween"
                          rowGap={4}
                          columnGap={2}
                          paddingY={2}
                          borderTopWidth="standard"
                          borderColor="red300"
                        >
                          <Text variant="h4" as="h4">
                            {category.label}
                          </Text>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => editQuestion(firstUnanswered.id)}
                          >
                            {formatMessage(m.overview.goToCategory)}
                          </Button>
                        </Box>
                      </Box>
                    ),
                  )}
                </Box>
              ) : (
                formatMessage(m.overview.confirmationRequired)
              )
            }
          />
        </Box>
      )}
    </Box>
  )
}

export default AssessmentOverview

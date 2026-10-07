import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  ProgressMeter,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { RadioController, InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'
import { assessmentOptions } from '../utils/options'
import {
  answerFieldId,
  answerKey,
  getAssessmentAnswers,
  getQuestionsData,
  groupQuestionsByCategory,
  isQuestionAnswered,
} from '../utils/assessment'
import { consumeFocusQuestionId } from '../utils/focusQuestion'
import { ASSESSMENT_ANSWERS_ID, AssessmentAnswer } from '../utils/constants'
import { AssessmentAnswers, AssessmentQuestion } from '../utils/types'

export const AssessmentQuestions: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()
  const { control } = useFormContext()

  const questionsData = getQuestionsData(application.externalData)
  const storedAnswers = getAssessmentAnswers(application.answers)

  // Watch the answers subtree so the selected category's progress bar updates
  // live as the applicant selects radio options.
  const watchedAnswers = useWatch({
    control,
    name: ASSESSMENT_ANSWERS_ID,
    defaultValue: storedAnswers,
  }) as AssessmentAnswers | undefined

  const countAnswered = (questions: AssessmentQuestion[]) =>
    questions.filter((q) =>
      isQuestionAnswered(watchedAnswers?.[answerKey(q.id)]),
    ).length

  // Currently selected category tab, so the inline progress bar tracks it.
  const [selectedId, setSelectedId] = useState<string>('')

  // Ids of accordion items the applicant has manually expanded.
  const [expandedIds, setExpandedIds] = useState<number[]>([])

  const toggleExpanded = (questionId: number, expanded: boolean) =>
    setExpandedIds((prev) =>
      expanded ? [...prev, questionId] : prev.filter((id) => id !== questionId),
    )

  // Collapse the current question and expand the next one, scrolling it into
  // view so the applicant can continue answering without hunting for it.
  const goToNextQuestion = (currentId: number, nextId: number) => {
    setExpandedIds((prev) => [
      ...prev.filter((id) => id !== currentId),
      ...(prev.includes(nextId) ? [] : [nextId]),
    ])

    setTimeout(() => {
      document
        .getElementById(`question-${nextId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const options = useMemo(
    () =>
      assessmentOptions.map((option) => ({
        value: option.value,
        label: formatMessage(option.label),
      })),
    [formatMessage],
  )

  const groups = useMemo(
    () => (questionsData ? groupQuestionsByCategory(questionsData) : []),
    [questionsData],
  )

  // The "Halda áfram" button steps through categories one at a time: it advances
  // the category selector and stays on this screen until the last category, then
  // lets the multiField proceed to the overview section.
  useEffect(() => {
    if (!setBeforeSubmitCallback) return

    setBeforeSubmitCallback(async () => {
      const currentIndex = Math.max(
        0,
        groups.findIndex(({ category }) => String(category.id) === selectedId),
      )

      if (currentIndex >= groups.length - 1) {
        return [true, null]
      }

      setSelectedId(String(groups[currentIndex + 1].category.id))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return [false, '']
    })
  }, [selectedId, groups, setBeforeSubmitCallback])

  // When arriving from an overview "edit" button, jump to that question: switch
  // to its category, expand it and scroll it into view.
  useEffect(() => {
    const focusId = consumeFocusQuestionId()
    if (focusId == null) return

    const group = groups.find(({ questions }) =>
      questions.some((q) => q.id === focusId),
    )
    if (!group) return

    setSelectedId(String(group.category.id))
    setExpandedIds((prev) =>
      prev.includes(focusId) ? prev : [...prev, focusId],
    )

    const timeout = setTimeout(() => {
      document
        .getElementById(`question-${focusId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // On arriving at a category, expand its first unanswered question so the
  // applicant can start answering right away. Only runs when the category
  // changes, so it never fights manual expand/collapse or an edit jump that
  // already opened a specific question.
  const autoExpandedCategory = useRef<string | null>(null)
  useEffect(() => {
    const currentIndex = Math.max(
      0,
      groups.findIndex(({ category }) => String(category.id) === selectedId),
    )
    const group = groups[currentIndex]
    if (!group) return

    const groupId = String(group.category.id)
    if (autoExpandedCategory.current === groupId) return
    autoExpandedCategory.current = groupId

    // Leave things as-is if a question in this category is already open.
    if (group.questions.some((q) => expandedIds.includes(q.id))) return

    const firstUnanswered = group.questions.find(
      (q) => !isQuestionAnswered(watchedAnswers?.[answerKey(q.id)]),
    )
    if (firstUnanswered) {
      setExpandedIds((prev) => [...prev, firstUnanswered.id])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, groups])

  if (!questionsData || questionsData.questions.length === 0) {
    return (
      <AlertMessage
        type="error"
        title={formatMessage(m.assessment.loadError)}
        message={formatMessage(m.assessment.loadError)}
      />
    )
  }

  const renderQuestion = (
    question: AssessmentQuestion,
    nextQuestion?: AssessmentQuestion,
  ) => {
    const stored = storedAnswers?.[`q${question.id}`]
    const expanded = expandedIds.includes(question.id)

    const isAnswered = isQuestionAnswered(
      watchedAnswers?.[answerKey(question.id)],
    )

    return (
      <AccordionItem
        key={question.id}
        id={`question-${question.id}`}
        expanded={expanded}
        onToggle={(value) => toggleExpanded(question.id, value)}
        label={
          <Text
            variant="h5"
            as="span"
            fontWeight={isAnswered ? 'regular' : 'semiBold'}
          >
            {question.questionText}
          </Text>
        }
        tooltip={question.tooltip || undefined}
        checkmark={isAnswered}
      >
        <RadioController
          id={answerFieldId(question.id, 'answerValue')}
          defaultValue={stored?.answerValue}
          split="1/2"
          smallScreenSplit="1/1"
          options={options}
        />
        <Box marginTop={2}>
          <InputController
            id={answerFieldId(question.id, 'remark')}
            defaultValue={stored?.remark ?? ''}
            label={formatMessage(m.assessment.remarkLabel)}
            placeholder={formatMessage(m.assessment.remarkPlaceholder)}
            textarea
            rows={4}
            backgroundColor="blue"
            required
          />
        </Box>
        {nextQuestion && (
          <Box marginTop={3} display="flex" justifyContent="flexEnd">
            <Button
              variant="utility"
              icon="arrowDown"
              onClick={() => goToNextQuestion(question.id, nextQuestion.id)}
            >
              {formatMessage(m.assessment.nextQuestion)}
            </Button>
          </Box>
        )}
      </AccordionItem>
    )
  }

  const categoryOptions = groups.map(({ category }) => ({
    value: String(category.id),
    label: category.shortLabel || category.label,
  }))

  const selectedGroup =
    groups.find(({ category }) => String(category.id) === selectedId) ??
    groups[0]
  const selectedValue =
    categoryOptions.find(
      (o) => o.value === selectedGroup?.category.id.toString(),
    ) ?? categoryOptions[0]
  const selectedTotal = selectedGroup?.questions.length ?? 0
  const selectedAnswered = selectedGroup
    ? countAnswered(selectedGroup.questions)
    : 0

  return (
    <Box>
      {selectedGroup && (
        <Text variant="h2" as="h2" marginBottom={3}>
          {selectedGroup.category.label}
        </Text>
      )}
      <Box
        display="flex"
        flexDirection={['column', 'row']}
        alignItems={['stretch', 'center']}
        columnGap={8}
        rowGap={2}
      >
        <Box style={{ flex: 1 }}>
          <Select
            name="assessment-category"
            label={formatMessage(m.assessment.categoryLabel)}
            size="sm"
            backgroundColor="blue"
            isSearchable={false}
            options={categoryOptions}
            value={selectedValue}
            onChange={(option) =>
              setSelectedId((option as { value: string } | null)?.value ?? '')
            }
          />
        </Box>
        <Box style={{ flex: 1 }}>
          <ProgressMeter
            progress={selectedTotal > 0 ? selectedAnswered / selectedTotal : 0}
            variant={
              selectedTotal > 0 && selectedAnswered === selectedTotal
                ? 'mint'
                : 'blue'
            }
          />
          <Text variant="small" color="blue400" textAlign="right" marginTop={1}>
            {formatMessage(m.assessment.progressLabel, {
              answered: selectedAnswered,
              total: selectedTotal,
            })}
          </Text>
        </Box>
      </Box>

      <Box marginTop={5}>
        <Accordion singleExpand={false} dividerOnBottom={false}>
          {selectedGroup?.questions.map((question, index) =>
            renderQuestion(question, selectedGroup.questions[index + 1]),
          )}
        </Accordion>
      </Box>
    </Box>
  )
}

export default AssessmentQuestions

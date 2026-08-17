import { FieldBaseProps } from '@island.is/application/types'
import { Box, LoadingDots, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useRef, useState } from 'react'
import { messages } from '../../lib/messages'
import {
  createDefaultJobFactors,
  SyncMethodEnum,
} from '../../utils/constants'
import type {
  JobFactor,
  PersonalFactor,
  ReportCriterionDto,
} from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync, type SyncCommand } from '../../utils/useDraftSync'
import { CriteriaItem } from './CriteriaItem'
import { PersonalCriteriaList } from './PersonalCriteriaList'

export const CriteriaEditor: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  setBeforeSubmitCallback,
  answerQuestions,
}) => {
  const { formatMessage } = useLocale()
  const { content, loading, refetch } = useDraftQuery<{
    criteria: ReportCriterionDto[]
  }>(application, 'DirectorateOfEquality.listDraftCriteria', 'draftCriteria')
  const { sync } = useDraftSync(application)

  const [jobFactors, setJobFactors] = useState<JobFactor[]>([])
  const [personalFactors, setPersonalFactors] = useState<PersonalFactor[]>([])
  const [removedPersonalIds, setRemovedPersonalIds] = useState<string[]>([])
  const originalPersonalIds = useRef<Set<string>>(new Set())
  const seeded = useRef(false)

  // Seed once, when the draft content first arrives — criteria are always
  // present by the time this screen is reachable (ExcelTemplateDownload
  // seeds the four job factors before advancing here).
  useEffect(() => {
    if (!content || seeded.current) return
    seeded.current = true

    const jobFromDraft = content.criteria
      .filter((c) => c.type !== 'PERSONAL')
      .map((c) => ({
        id: c.id,
        type: c.type,
        title: c.title,
        description: c.description,
        weight: String(c.weight),
      }))
    const personalFromDraft = content.criteria
      .filter((c) => c.type === 'PERSONAL')
      .map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        weight: String(c.weight),
      }))

    setJobFactors(
      jobFromDraft.length > 0 ? jobFromDraft : createDefaultJobFactors(),
    )
    setPersonalFactors(personalFromDraft)
    originalPersonalIds.current = new Set(personalFromDraft.map((f) => f.id))
  }, [content])

  const totalWeight = [...jobFactors, ...personalFactors].reduce(
    (sum, f) => sum + (Number(f.weight) || 0),
    0,
  )

  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      if (totalWeight !== 0 && Math.abs(totalWeight - 100) > 0.001) {
        return [
          false,
          formatMessage(messages.report.criteria.weightSumError, {
            total: totalWeight,
          }),
        ]
      }

      const jobCommands: SyncCommand[] = jobFactors.map((f) => ({
        method: SyncMethodEnum.UPDATE,
        id: f.id,
        data: {
          title: f.title,
          description: f.description,
          weight: Number(f.weight) || 0,
          type: f.type,
        },
      }))
      const personalCommands: SyncCommand[] = personalFactors.map((f) => ({
        method: originalPersonalIds.current.has(f.id)
          ? SyncMethodEnum.UPDATE
          : SyncMethodEnum.CREATE,
        id: f.id,
        data: {
          title: f.title,
          description: f.description ?? '',
          weight: Number(f.weight) || 0,
          type: 'PERSONAL',
        },
      }))
      const removeCommands: SyncCommand[] = removedPersonalIds.map((id) => ({
        method: SyncMethodEnum.REMOVE,
        id,
      }))

      try {
        await sync({
          criteria: [...jobCommands, ...personalCommands, ...removeCommands],
        })
        // Silent: we're about to navigate away, so don't flash a loading state
        // on the current screen.
        await refetch({ silent: true })
      } catch {
        return [false, formatMessage(messages.errors.draftSyncFailed)]
      }
      // Answers-backed navigation signal for
      // `employeeClassificationSubSection`'s visibility condition — see the
      // comment on `hasPersonalCriteria` in dataSchema.ts for why this can't
      // just be read off externalData directly.
      answerQuestions?.({ hasPersonalCriteria: personalFactors.length > 0 })
      return [true, null]
    })
  }, [
    refetch,
    answerQuestions,
    setBeforeSubmitCallback,
    jobFactors,
    personalFactors,
    removedPersonalIds,
    totalWeight,
    formatMessage,
    sync,
  ])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" paddingY={5}>
        <LoadingDots />
      </Box>
    )
  }

  return (
    <Box>
      <Text variant="h4" marginBottom={2}>
        {formatMessage(messages.report.criteria.jobFactorTitle)}
      </Text>
      <Text marginBottom={3}>
        {formatMessage(messages.report.criteria.jobFactorIntro)}
      </Text>

      <Box>
        {jobFactors.map((factor, i) => (
          <CriteriaItem
            key={factor.id}
            title={factor.title}
            description={factor.description}
            weight={factor.weight}
            onWeightChange={(weight) =>
              setJobFactors((prev) =>
                prev.map((f, idx) => (idx === i ? { ...f, weight } : f)),
              )
            }
            isLast={i === jobFactors.length - 1}
          />
        ))}
      </Box>

      <PersonalCriteriaList
        personalFactors={personalFactors}
        onChange={setPersonalFactors}
        onRemove={(id) => {
          setPersonalFactors((prev) => prev.filter((f) => f.id !== id))
          if (originalPersonalIds.current.has(id)) {
            setRemovedPersonalIds((prev) => [...prev, id])
          }
        }}
      />

      {totalWeight !== 0 && totalWeight !== 100 && (
        <Box marginTop={3}>
          <Text color="red600">
            {formatMessage(messages.report.criteria.weightSumError, {
              total: totalWeight,
            })}
          </Text>
        </Box>
      )}
    </Box>
  )
}

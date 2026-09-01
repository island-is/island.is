import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'
import { FC, useEffect, useRef, useState } from 'react'
import { messages } from '../../lib/messages'
import {
  ApiActions,
  createDefaultJobFactors,
  draftActionId,
  SyncMethodEnum,
} from '../../utils/constants'
import type {
  JobFactor,
  PersonalFactor,
  ReportCriterionDto,
  SyncCommand,
} from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync } from '../../utils/useDraftSync'
import { useSeedOnce } from '../../utils/useSeedOnce'
import {
  DraftErrorState,
  DraftLoadingState,
} from '../../components/DraftScreenState'
import { CriteriaItem } from './CriteriaItem'
import { PersonalCriteriaList } from './PersonalCriteriaList'

export const CriteriaEditor: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  setBeforeSubmitCallback,
  answerQuestions,
}) => {
  const { formatMessage } = useLocale()
  const { content, loading, hasError, refetch } = useDraftQuery<{
    criteria: ReportCriterionDto[]
  }>(application, draftActionId(ApiActions.listDraftCriteria), 'draftCriteria')
  const { sync } = useDraftSync(application)

  const [jobFactors, setJobFactors] = useState<JobFactor[]>([])
  const [personalFactors, setPersonalFactors] = useState<PersonalFactor[]>([])
  const [removedPersonalIds, setRemovedPersonalIds] = useState<string[]>([])
  // Ids the draft actually holds, so the flush below can tell an UPDATE from a
  // CREATE. Job factors need this as much as personal ones do: when the draft
  // carries no criteria yet (no workbook imported, or an import that produced
  // none), the four defaults are minted client-side with fresh UUIDs, and
  // UPDATEing an id DMR has never seen 404s the whole batch.
  const originalJobIds = useRef<Set<string>>(new Set())
  const originalPersonalIds = useRef<Set<string>>(new Set())

  useSeedOnce(Boolean(content), () => {
    if (!content) return
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
    originalJobIds.current = new Set(jobFromDraft.map((f) => f.id))
    originalPersonalIds.current = new Set(personalFromDraft.map((f) => f.id))
  })

  const totalWeight = [...jobFactors, ...personalFactors].reduce(
    (sum, f) => sum + (Number(f.weight) || 0),
    0,
  )
  const hasCriteria = jobFactors.length + personalFactors.length > 0
  const hasWeightMismatch = hasCriteria && Math.abs(totalWeight - 100) > 0.001

  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      if (hasWeightMismatch) {
        return [
          false,
          formatMessage(messages.report.criteria.weightSumError, {
            total: totalWeight,
          }),
        ]
      }

      const jobCommands: SyncCommand[] = jobFactors.map((f) => ({
        method: originalJobIds.current.has(f.id)
          ? SyncMethodEnum.UPDATE
          : SyncMethodEnum.CREATE,
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
        // What was just written is now what the draft holds, so the diff
        // baseline moves with it. Without this a second flush from the same
        // mount would re-send the same REMOVEs — for rows DMR has already
        // deleted, which 404s the batch.
        originalJobIds.current = new Set(jobFactors.map((f) => f.id))
        originalPersonalIds.current = new Set(personalFactors.map((f) => f.id))
        setRemovedPersonalIds([])
        // Silent: about to navigate away, so don't flash a loading state.
        await refetch({ silent: true })
      } catch {
        return [false, formatMessage(messages.errors.draftSyncFailed)]
      }
      // Answers-backed navigation signal (see `hasPersonalCriteria` in
      // dataSchema.ts for why this can't be read off externalData directly).
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
    hasWeightMismatch,
    totalWeight,
    formatMessage,
    sync,
  ])

  if (loading) {
    return <DraftLoadingState />
  }

  if (hasError || !content) {
    return <DraftErrorState onRetry={() => refetch()} />
  }

  return (
    <Box>
      <Text variant="h4" marginBottom={2}>
        {formatMessage(messages.report.criteria.jobFactorTitle)}
      </Text>
      <Box marginBottom={3}>
        <Markdown>
          {formatMessage(messages.report.criteria.jobFactorIntro)}
        </Markdown>
      </Box>

      <Box>
        {jobFactors.map((factor, i) => (
          <CriteriaItem
            key={factor.id}
            id={factor.id}
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

      {hasWeightMismatch && (
        <Box marginTop={3}>
          <AlertMessage
            type="error"
            title={formatMessage(messages.errors.alertTitle)}
            message={formatMessage(messages.report.criteria.weightSumError, {
              total: totalWeight,
            })}
          />
        </Box>
      )}
    </Box>
  )
}

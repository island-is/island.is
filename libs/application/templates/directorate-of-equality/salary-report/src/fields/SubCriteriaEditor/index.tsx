import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useMemo, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { messages } from '../../lib/messages'
import {
  createDefaultSubCriterion,
  SyncMethodEnum,
} from '../../utils/constants'
import type {
  DraftCriterionWithSubCriteriaDto,
  SubCriterion,
} from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync, type SyncCommand } from '../../utils/useDraftSync'
import { CriterionPanel } from './CriterionPanel'

// Fixed 1000-point scale (weights sum to 100); mirrors JobClassificationEditor/utils.ts and DMR's own scoring.
const POINTS_PER_WEIGHT_PERCENT = 10

export type SubCriteriaFormValues = Record<string, SubCriterion[]>

export const SubCriteriaEditor: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()
  const { content, loading, hasError, refetch } = useDraftQuery<{
    criteria: DraftCriterionWithSubCriteriaDto[]
  }>(
    application,
    'DirectorateOfEquality.getDraftCriteriaTree',
    'draftCriteriaTree',
  )
  const { sync } = useDraftSync(application)
  const methods = useForm<SubCriteriaFormValues>({ defaultValues: {} })

  // Diffed against the final form value at Continue time: missing => REMOVE, unseen => CREATE.
  const originalSubCriterionIds = useRef<Set<string>>(new Set())
  const originalStepIds = useRef<Set<string>>(new Set())
  const seeded = useRef(false)

  const jobCriteria = useMemo(
    () => (content?.criteria ?? []).filter((c) => c.type !== 'PERSONAL'),
    [content],
  )
  const personalCriteria = useMemo(
    () => (content?.criteria ?? []).filter((c) => c.type === 'PERSONAL'),
    [content],
  )

  useEffect(() => {
    if (!content || seeded.current) return
    seeded.current = true

    const subIds = new Set<string>()
    const stepIds = new Set<string>()
    const values: SubCriteriaFormValues = {}

    content.criteria.forEach((criterion) => {
      const subCriteria = criterion.subCriteria
      if (subCriteria.length === 0) {
        values[criterion.id] = [createDefaultSubCriterion(criterion.id)]
        return
      }
      values[criterion.id] = subCriteria.map((sc) => {
        subIds.add(sc.id)
        const steps = sc.steps
        steps.forEach((s) => stepIds.add(s.id))
        return {
          id: sc.id,
          criterionId: criterion.id,
          title: sc.title,
          description: sc.description,
          weight: String(sc.weight),
          stepCount: String(steps.length || 2),
          steps:
            steps.length > 0
              ? [...steps]
                  .sort((a, b) => a.order - b.order)
                  .map((s) => ({ id: s.id, description: s.description }))
              : [
                  { id: crypto.randomUUID(), description: '' },
                  { id: crypto.randomUUID(), description: '' },
                ],
        }
      })
    })

    originalSubCriterionIds.current = subIds
    originalStepIds.current = stepIds
    methods.reset(values)
  }, [content, methods])

  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      const values = methods.getValues()
      const allGroups = Object.values(values).flat()

      const seenFinalSubIds = new Set(allGroups.map((sc) => sc.id))
      const seenFinalStepIds = new Set(
        allGroups.flatMap((sc) => sc.steps.map((s) => s.id)),
      )

      const subCriteriaCommands: SyncCommand[] = allGroups.map((sc) => ({
        method: originalSubCriterionIds.current.has(sc.id)
          ? SyncMethodEnum.UPDATE
          : SyncMethodEnum.CREATE,
        id: sc.id,
        data: {
          criterionId: sc.criterionId,
          title: sc.title,
          description: sc.description ?? '',
          weight: Number(sc.weight) || 0,
        },
      }))
      const removedSubCriteriaCommands: SyncCommand[] = [
        ...originalSubCriterionIds.current,
      ]
        .filter((id) => !seenFinalSubIds.has(id))
        .map((id) => ({ method: SyncMethodEnum.REMOVE, id }))

      const stepCommands: SyncCommand[] = allGroups.flatMap((sc) => {
        const count = sc.steps.length
        const weight = Number(sc.weight) || 0
        const maxScore = weight * POINTS_PER_WEIGHT_PERCENT
        const perStep = count > 0 ? maxScore / count : 0
        return sc.steps.map((step, i) => ({
          method: originalStepIds.current.has(step.id)
            ? SyncMethodEnum.UPDATE
            : SyncMethodEnum.CREATE,
          id: step.id,
          data: {
            subCriterionId: sc.id,
            order: i + 1,
            description: step.description,
            score: (i + 1) * perStep,
          },
        }))
      })
      const removedStepCommands: SyncCommand[] = [...originalStepIds.current]
        .filter((id) => !seenFinalStepIds.has(id))
        .map((id) => ({ method: SyncMethodEnum.REMOVE, id }))

      try {
        await sync({
          subCriteria: [...subCriteriaCommands, ...removedSubCriteriaCommands],
          steps: [...stepCommands, ...removedStepCommands],
        })
        // Silent: about to navigate away, so don't flash a loading state.
        await refetch({ silent: true })
      } catch {
        return [false, formatMessage(messages.errors.draftSyncFailed)]
      }
      return [true, null]
    })
  }, [setBeforeSubmitCallback, methods, sync, refetch, formatMessage])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" paddingY={5}>
        <LoadingDots />
      </Box>
    )
  }

  if (hasError || !content) {
    return (
      <Box>
        <AlertMessage
          type="error"
          message={formatMessage(messages.errors.draftLoadFailed)}
        />
        <Box marginTop={2}>
          <Button
            variant="ghost"
            size="small"
            icon="reload"
            onClick={() => refetch()}
          >
            {formatMessage(messages.errors.retryButton)}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <FormProvider {...methods}>
      <Box>
        <Stack space={4}>
          <Box>
            <Text variant="h4" marginBottom={1}>
              {formatMessage(messages.report.subCriteria.jobFactorGroupTitle)}
            </Text>
            <Text marginBottom={3}>
              {formatMessage(messages.report.subCriteria.jobFactorGroupIntro)}
            </Text>
            <Stack space={3}>
              {jobCriteria.map((criterion, i) => (
                <CriterionPanel
                  key={criterion.id}
                  criterionId={criterion.id}
                  accordionId={`subCriteria-job-${criterion.id}`}
                  criterionTitle={criterion.title}
                  criterionWeight={String(criterion.weight)}
                  startExpanded={i === 0}
                />
              ))}
            </Stack>
          </Box>

          {personalCriteria.length > 0 && (
            <Box>
              <Text variant="h4" marginBottom={1}>
                {formatMessage(
                  messages.report.subCriteria.personalFactorGroupTitle,
                )}
              </Text>
              <Text marginBottom={3}>
                {formatMessage(
                  messages.report.subCriteria.personalFactorGroupIntro,
                )}
              </Text>
              <Stack space={3}>
                {personalCriteria.map((criterion, i) => (
                  <CriterionPanel
                    key={criterion.id}
                    criterionId={criterion.id}
                    accordionId={`subCriteria-personal-${criterion.id}`}
                    criterionTitle={criterion.title}
                    criterionWeight={String(criterion.weight)}
                    startExpanded={i === 0}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </FormProvider>
  )
}

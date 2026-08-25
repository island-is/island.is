import { FieldBaseProps } from '@island.is/application/types'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useMemo, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { messages } from '../../lib/messages'
import {
  ApiActions,
  createDefaultSubCriterion,
  draftActionId,
} from '../../utils/constants'
import type {
  DraftCriterionWithSubCriteriaDto,
  SubCriterion,
} from '../../utils/types'
import type { SubCriterionCatalogEntryDto } from '@island.is/clients/directorate-of-equality'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync } from '../../utils/useDraftSync'
import { useSeedOnce } from '../../utils/useSeedOnce'
import { buildUpsertRemoveCommands } from '../../utils/syncCommands'
import { getPathValue } from '../../utils/answerHelpers'
import {
  DraftErrorState,
  DraftLoadingState,
} from '../../components/DraftScreenState'
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
    draftActionId(ApiActions.getDraftCriteriaTree),
    'draftCriteriaTree',
  )
  const { sync } = useDraftSync(application)
  const methods = useForm<SubCriteriaFormValues>({ defaultValues: {} })

  // Catalog is reference data (Jafnréttisstofa's own list), not draft state —
  // still fetched via externalData rather than the live draft query.
  const catalogEntries = getPathValue<SubCriterionCatalogEntryDto[]>(
    application.externalData,
    'subCriterionCatalog.data.entries',
    [],
  )

  // Diffed against the final form value at Continue time: missing => REMOVE, unseen => CREATE.
  const originalSubCriterionIds = useRef<Set<string>>(new Set())
  const originalStepIds = useRef<Set<string>>(new Set())

  const jobCriteria = useMemo(
    () => (content?.criteria ?? []).filter((c) => c.type !== 'PERSONAL'),
    [content],
  )
  const personalCriteria = useMemo(
    () => (content?.criteria ?? []).filter((c) => c.type === 'PERSONAL'),
    [content],
  )

  // Job criteria match the catalog on parentTitle because their four titles are
  // seeded read-only constants that mirror the catalog's Yfirviðmið. Personal
  // criterion titles are user-authored free text, so the same match finds
  // nothing — the catalog groups every employer-authored entry under several
  // distinct parentTitles (Aukaábyrgð, Þekking og reynsla, Færni, Frammistaða)
  // and none of them is what the applicant typed. Select on the type instead.
  const personalCatalogEntries = useMemo(
    () => catalogEntries.filter((e) => e.criterionType === 'PERSONAL'),
    [catalogEntries],
  )

  useSeedOnce(Boolean(content), () => {
    if (!content) return
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
  })

  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      const values = methods.getValues()
      const allGroups = Object.values(values).flat()

      const subCriteriaCommands = buildUpsertRemoveCommands(
        originalSubCriterionIds.current,
        allGroups.map((sc) => ({
          id: sc.id,
          data: {
            criterionId: sc.criterionId,
            title: sc.title,
            description: sc.description ?? '',
            weight: Number(sc.weight) || 0,
          },
        })),
      )

      const stepCommands = buildUpsertRemoveCommands(
        originalStepIds.current,
        allGroups.flatMap((sc) => {
          const count = sc.steps.length
          const weight = Number(sc.weight) || 0
          const maxScore = weight * POINTS_PER_WEIGHT_PERCENT
          const perStep = count > 0 ? maxScore / count : 0
          return sc.steps.map((step, i) => ({
            id: step.id,
            data: {
              subCriterionId: sc.id,
              order: i + 1,
              description: step.description,
              score: (i + 1) * perStep,
            },
          }))
        }),
      )

      try {
        await sync({
          subCriteria: subCriteriaCommands,
          steps: stepCommands,
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
    return <DraftLoadingState />
  }

  if (hasError || !content) {
    return <DraftErrorState onRetry={() => refetch()} />
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
                  catalogEntries={catalogEntries.filter(
                    (e) => e.parentTitle === criterion.title,
                  )}
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
                    catalogEntries={personalCatalogEntries}
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

import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { messages } from '../../lib/messages'
import {
  ApiActions,
  draftActionId,
  SyncMethodEnum,
} from '../../utils/constants'
import type {
  DisplayAssignment,
  DraftCriterionWithSubCriteriaDto,
  DraftRoleWithStepsDto,
  SyncCommand,
} from '../../utils/types'
import { useDraftQueries } from '../../utils/useDraftQuery'
import { useDraftSync } from '../../utils/useDraftSync'
import { useSeedOnce } from '../../utils/useSeedOnce'
import { useProgressMarker } from '../../utils/useProgressMarker'
import {
  DraftErrorState,
  DraftLoadingState,
} from '../../components/DraftScreenState'
import { RolePanel } from './RolePanel'
import {
  buildDisplayAssignments,
  buildStepMetaBySubCriterionId,
  resolveStepIds,
} from './utils'

type RoleFormEntry = { roleId: string; assignments: DisplayAssignment[] }
type FormValues = { roles: RoleFormEntry[] }

export const JobClassificationEditor: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, setBeforeSubmitCallback, answerQuestions }) => {
  const { formatMessage } = useLocale()
  // Both reads in one mutation — see the batching note on useDraftQueries.
  const { contents, loading, hasError, refetch } = useDraftQueries<{
    draftCriteriaTree: { criteria: DraftCriterionWithSubCriteriaDto[] }
    draftRolesWithSteps: { roles: DraftRoleWithStepsDto[] }
  }>(application, {
    draftCriteriaTree: draftActionId(ApiActions.getDraftCriteriaTree),
    draftRolesWithSteps: draftActionId(ApiActions.listDraftRolesWithSteps),
  })
  const criteriaContent = contents.draftCriteriaTree
  const rolesContent = contents.draftRolesWithSteps
  const { sync } = useDraftSync(application)
  const markProgress = useProgressMarker(application.id, answerQuestions)
  const methods = useForm<FormValues>({ defaultValues: { roles: [] } })

  const roles = rolesContent?.roles ?? []

  const jobCriteria = useMemo(
    () =>
      (criteriaContent?.criteria ?? []).filter((c) => c.type !== 'PERSONAL'),
    [criteriaContent],
  )
  const stepMetaBySubCriterionId = useMemo(
    () => buildStepMetaBySubCriterionId(jobCriteria),
    [jobCriteria],
  )

  useSeedOnce(Boolean(criteriaContent && rolesContent), () => {
    const formRoles: RoleFormEntry[] = roles.map((role) => ({
      roleId: role.id,
      assignments: buildDisplayAssignments(jobCriteria, role.stepIds),
    }))
    methods.reset({ roles: formRoles })
  })

  useEffect(() => {
    if (!setBeforeSubmitCallback || !criteriaContent || !rolesContent) return
    setBeforeSubmitCallback(async () => {
      const values = methods.getValues().roles
      const roleCommands: SyncCommand[] = values.map((entry) => ({
        method: SyncMethodEnum.UPDATE,
        id: entry.roleId,
        data: { stepIds: resolveStepIds(jobCriteria, entry.assignments) },
      }))
      try {
        await sync({ roles: roleCommands })
        // Silent: about to navigate away, so don't flash a loading state.
        await Promise.all([refetch({ silent: true })])
      } catch {
        return [false, formatMessage(messages.errors.draftSyncFailed)]
      }
      // The step is behind them now, so a later visit should not send them back
      // to it — see ProgressPaths.
      await markProgress({ jobClassification: true })
      return [true, null]
    })
  }, [
    setBeforeSubmitCallback,
    markProgress,
    methods,
    sync,
    refetch,
    criteriaContent,
    rolesContent,
    jobCriteria,
    formatMessage,
  ])

  if (hasError) {
    return <DraftErrorState onRetry={() => refetch()} />
  }

  if (loading || !criteriaContent || !rolesContent) {
    return <DraftLoadingState />
  }

  if (roles.length === 0) {
    return (
      <Box>
        <AlertMessage
          type="info"
          message={formatMessage(
            messages.report.jobClassification.noRolesMessage,
          )}
        />
      </Box>
    )
  }

  return (
    <FormProvider {...methods}>
      <Box>
        <Stack space={2}>
          {roles.map((role, index) => (
            <RolePanel
              key={role.id}
              roleTitle={role.title}
              roleIndex={index}
              assignments={buildDisplayAssignments(jobCriteria, role.stepIds)}
              stepMetaBySubCriterionId={stepMetaBySubCriterionId}
            />
          ))}
        </Stack>
      </Box>
    </FormProvider>
  )
}

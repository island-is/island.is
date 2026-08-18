import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useFormContext, useWatch } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { getValueViaPath, YES } from '@island.is/application/core'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { isOutlierGroupComplete } from '../../utils/outlierGroups'
import type { OutlierGroupAnswer } from '../../utils/outlierGroups'
import { SyncMethodEnum } from '../../utils/constants'
import { formatCurrency } from '../EmployeesEditor/utils'
import type {
  DraftOutlierGroupDto,
  ReportEmployeeDto,
} from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync, type SyncCommand } from '../../utils/useDraftSync'
import {
  getActionErrorMessage,
  type ActionExternalData,
} from '../../utils/errors'
import { OutlierGroupPanel } from './OutlierGroupPanel'

interface Props extends FieldBaseProps {
  field: CustomField
}

type AnalysisExternalData = ActionExternalData<SalaryAnalysisResponseDto>

// `postponed` is answers-backed and lives on the ambient global form in
// both phases — it is NOT part of this local shape. Only `outlierGroups`
// is local here, since it's DMR-synced rather than answers-backed pre-submit.
type DraftOutlierFormValues = {
  salaryAnalysis: {
    outlierGroups: OutlierGroupAnswer[]
  }
}

export const SalaryAnalysisResults: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  errors,
  setBeforeSubmitCallback,
}) => {
  const hidePostponeCheckbox =
    field?.props && typeof field.props['hidePostponeCheckbox'] === 'boolean'
      ? (field.props['hidePostponeCheckbox'] as boolean)
      : false
  // Pre-submit (still DRAFT): outlier grouping is persisted to the DMR
  // draft, in a local form scoped to this screen — never applicationAnswers.
  // Post-submit (POSTPONED review): unchanged, answers-backed behavior via
  // the ambient global form.
  const isDraftPhase = !hidePostponeCheckbox

  const { formatMessage, lang: locale } = useLocale()
  const {
    content: outlierGroupsContent,
    hasError: outlierGroupsHasError,
    refetch: refetchOutlierGroups,
  } = useDraftQuery<{ groups: DraftOutlierGroupDto[] }>(
    application,
    'DirectorateOfEquality.listDraftOutlierGroups',
    'draftOutlierGroups',
  )
  const {
    content: employeesContent,
    hasError: employeesHasError,
    refetch: refetchEmployees,
  } = useDraftQuery<{ employees: ReportEmployeeDto[] }>(
    application,
    'DirectorateOfEquality.listDraftEmployees',
    'draftEmployees',
  )
  // Relevant in draft phase only — POSTPONED-review doesn't read the draft
  // at all (see `isDraftPhase` below).
  const hasDraftReadError = outlierGroupsHasError || employeesHasError
  const content = useMemo(
    () =>
      outlierGroupsContent && employeesContent
        ? {
            outlierGroups: outlierGroupsContent.groups,
            employees: employeesContent.employees,
          }
        : undefined,
    [outlierGroupsContent, employeesContent],
  )
  const refetch = useCallback(
    (options?: { silent?: boolean }) =>
      Promise.all([
        refetchOutlierGroups(options),
        refetchEmployees(options),
      ]),
    [refetchOutlierGroups, refetchEmployees],
  )
  const { sync } = useDraftSync(application)
  const draftForm = useForm<DraftOutlierFormValues>({
    defaultValues: { salaryAnalysis: { outlierGroups: [] } },
  })

  // `postponed` is answers-backed in both phases — always read/write it
  // against the true ambient application form, never the local `draftForm`
  // (which only exists for the not-answers-backed `outlierGroups`).
  const { control: ambientControl } = useFormContext()
  const postponed: string[] =
    useWatch({
      name: 'salaryAnalysis.postponed',
      control: ambientControl,
    }) ?? []
  const isPostponed = postponed.includes(YES)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [result, setResult] = useState<SalaryAnalysisResponseDto | undefined>(
    () => {
      const initial = getValueViaPath<AnalysisExternalData>(
        application.externalData,
        'salaryAnalysisResult',
      )
      return initial?.status === 'success' ? initial.data : undefined
    },
  )

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setHasError(false)
    setErrorMessage(undefined)
    try {
      const res = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: 'DirectorateOfEquality.analyzeSalaryReport',
                order: 0,
              },
            ],
          },
          locale,
        },
      })
      const salaryAnalysisResult = res.data?.updateApplicationExternalData
        .externalData?.salaryAnalysisResult as AnalysisExternalData | undefined
      if (
        salaryAnalysisResult?.status === 'success' &&
        salaryAnalysisResult.data
      ) {
        setResult(salaryAnalysisResult.data)
      } else {
        setErrorMessage(getActionErrorMessage(salaryAnalysisResult?.reason))
        setHasError(true)
      }
    } catch {
      setHasError(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Run automatically on arrival at this screen — the applicant shouldn't
  // have to press a button to see results. Only fires when there's no
  // existing result yet (e.g. from a prior visit to this screen).
  useEffect(() => {
    if (result) return
    handleAnalyze()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Draft-phase only: seed the local outlier-group form from the draft's
  // current groups, mapping each member's employee id back to the ordinal
  // the outlier table/UI works in (ordinal is what DMR's analysis response
  // uses to identify an outlier row).
  useEffect(() => {
    if (!isDraftPhase || !content) return
    const employeeOrdinalById: Record<string, number> = Object.fromEntries(
      content.employees.map((e) => [e.id, e.ordinal]),
    )
    draftForm.reset({
      salaryAnalysis: {
        outlierGroups: content.outlierGroups.map((g) => ({
          id: g.id,
          reason: g.reason ?? '',
          action: g.action ?? '',
          signatureName: g.signatureName ?? '',
          signatureRole: g.signatureRole ?? '',
          employeeOrdinals: g.memberEmployeeIds
            .map((id) => employeeOrdinalById[id])
            .filter((o): o is number => o !== undefined),
        })),
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraftPhase, content])

  const identifierForOrdinal = useMemo(() => {
    // Draft phase: the employee's own client-minted id is the stable,
    // consistent-across-screens display handle (see EmployeesEditor).
    // Postponed phase: the draft is gone (already submitted) — there's no
    // resolved identifier source for the frozen submitted report yet, so
    // this falls back to the ordinal. See the POSTPONED-analysis gap noted
    // separately; whatever resolves that should also resolve this.
    if (isDraftPhase && content) {
      const employeeIdByOrdinal: Record<number, string> = Object.fromEntries(
        content.employees.map((e) => [e.ordinal, e.id]),
      )
      return (ordinal: number) => employeeIdByOrdinal[ordinal] ?? `#${ordinal}`
    }
    return (ordinal: number) => `#${ordinal}`
  }, [isDraftPhase, content])

  const watchedOutlierGroups: OutlierGroupAnswer[] = useWatch({
    name: 'salaryAnalysis.outlierGroups',
    control: isDraftPhase ? draftForm.control : undefined,
  }) ?? []
  const outlierGroups = watchedOutlierGroups

  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      if (isAnalyzing) {
        return [false, formatMessage(messages.salaryAnalysis.results.analyzing)]
      }
      if (hasError) {
        return [
          false,
          errorMessage ??
            formatMessage(messages.salaryAnalysis.results.analyzeError),
        ]
      }
      // Draft-phase reads failed — bail out here rather than falling through
      // to the `isDraftPhase && content` sync block below, which silently
      // skips syncing (and drops) the applicant's outlier-group work when
      // `content` is undefined.
      if (isDraftPhase && hasDraftReadError) {
        refetch()
        return [false, formatMessage(messages.errors.draftLoadFailed)]
      }
      // Postponing the improvement plan exempts the applicant from grouping
      // and explaining outliers here entirely.
      const currentOutliers = result?.outliers ?? []
      if (!isPostponed && currentOutliers.length > 0) {
        const assignedOrdinals = new Set(
          outlierGroups.flatMap((g) => g.employeeOrdinals),
        )
        const allOutliersAssigned = currentOutliers.every((o) =>
          assignedOrdinals.has(o.employeeOrdinal),
        )
        if (!allOutliersAssigned) {
          return [
            false,
            formatMessage(
              messages.salaryAnalysis.outlierGroup.unassignedWarning,
            ),
          ]
        }
        const groupsComplete = outlierGroups.every(isOutlierGroupComplete)
        if (!groupsComplete) {
          return [
            false,
            formatMessage(
              messages.salaryAnalysis.outlierGroup.incompleteGroupWarning,
            ),
          ]
        }
      }

      // Draft-phase: persist the outlier grouping to DMR before continuing.
      // Post-submit (POSTPONED): nothing to sync — the explanation fields
      // stay answers-backed and are saved the normal way.
      if (isDraftPhase && content) {
        const employeeIdByOrdinal: Record<number, string> = Object.fromEntries(
          content.employees.map((e) => [e.ordinal, e.id]),
        )
        const originalGroupIds = new Set(
          content.outlierGroups.map((g) => g.id),
        )
        const finalGroups = draftForm.getValues().salaryAnalysis.outlierGroups
        // Every group carries its own id from creation (see OutlierEditor's
        // handleCreateGroup) — identity tracks by id, not array position, so
        // removing an earlier group doesn't misattribute a later one's
        // commands. Falling back to a fresh id if one is somehow missing is
        // still safe — it's just treated as a new group (CREATE).
        const groupIds = finalGroups.map((g) => g.id ?? crypto.randomUUID())

        const outlierGroupCommands: SyncCommand[] = finalGroups.map(
          (g, i) => ({
            method: originalGroupIds.has(groupIds[i])
              ? SyncMethodEnum.UPDATE
              : SyncMethodEnum.CREATE,
            id: groupIds[i],
            data: {
              reason: g.reason || null,
              action: g.action || null,
              signatureName: g.signatureName || null,
              signatureRole: g.signatureRole || null,
            },
          }),
        )
        const keptGroupIds = new Set(groupIds)
        const removedGroupCommands: SyncCommand[] = [...originalGroupIds]
          .filter((id) => !keptGroupIds.has(id))
          .map((id) => ({ method: SyncMethodEnum.REMOVE, id }))

        const memberOfGroup = new Map<string, string>()
        finalGroups.forEach((g, i) => {
          g.employeeOrdinals.forEach((ordinal) => {
            const employeeId = employeeIdByOrdinal[ordinal]
            if (employeeId) memberOfGroup.set(employeeId, groupIds[i])
          })
        })
        // Every employee that was a member of a removed/changed group and
        // isn't a member of any surviving one gets cleared.
        const employeeCommands: SyncCommand[] = content.outlierGroups.flatMap(
          (g) =>
            g.memberEmployeeIds.map((employeeId) => ({
              method: SyncMethodEnum.UPDATE,
              id: employeeId,
              data: { outlierGroupId: memberOfGroup.get(employeeId) ?? null },
            })),
        )
        memberOfGroup.forEach((groupId, employeeId) => {
          if (!employeeCommands.some((c) => c.id === employeeId)) {
            employeeCommands.push({
              method: SyncMethodEnum.UPDATE,
              id: employeeId,
              data: { outlierGroupId: groupId },
            })
          }
        })

        try {
          await sync({
            outlierGroups: [...outlierGroupCommands, ...removedGroupCommands],
            employees: employeeCommands,
          })
          // Refresh externalData now in case the applicant navigates back
          // to an earlier screen later in this session.
          await refetch()
        } catch {
          return [false, formatMessage(messages.errors.draftSyncFailed)]
        }
      }

      return [true, null]
    })
  }, [
    setBeforeSubmitCallback,
    isAnalyzing,
    hasError,
    errorMessage,
    formatMessage,
    isPostponed,
    outlierGroups,
    result,
    isDraftPhase,
    content,
    draftForm,
    sync,
    refetch,
    hasDraftReadError,
  ])

  const totals = result?.baseSalaryByGenderAndScoreAll?.totals
  const outlierCount = result?.outliers?.length ?? 0

  const body = (
    <Box>
      {isAnalyzing && (
        <Box display="flex" justifyContent="center" paddingY={5}>
          <LoadingDots />
        </Box>
      )}

      {hasError && (
        <Box marginBottom={3}>
          <AlertMessage
            type="error"
            message={
              errorMessage ??
              formatMessage(messages.salaryAnalysis.results.analyzeError)
            }
          />
          <Box marginTop={2}>
            <Button
              variant="ghost"
              size="small"
              icon="reload"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {formatMessage(messages.salaryAnalysis.results.recalculateButton)}
            </Button>
          </Box>
        </Box>
      )}

      {isDraftPhase && hasDraftReadError && (
        <Box marginBottom={3}>
          <AlertMessage
            type="error"
            message={formatMessage(messages.errors.draftLoadFailed)}
          />
        </Box>
      )}

      {totals && (
        <Box marginBottom={4}>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(messages.salaryAnalysis.results.totalsTitle)}
          </Text>
          <GridRow rowGap={2}>
            <GridColumn span={['12/12', '4/12']}>
              <Text variant="eyebrow">
                {formatMessage(messages.salaryAnalysis.results.maleLabel)}
              </Text>
              <Text variant="h3">
                {formatCurrency(totals.maleAverageSalary)}
              </Text>
            </GridColumn>
            <GridColumn span={['12/12', '4/12']}>
              <Text variant="eyebrow">
                {formatMessage(messages.salaryAnalysis.results.femaleLabel)}
              </Text>
              <Text variant="h3">
                {formatCurrency(totals.femaleAverageSalary)}
              </Text>
            </GridColumn>
          </GridRow>
          {typeof totals.wageGapPercent === 'number' && (
            <Box marginTop={3}>
              <Text variant="eyebrow">
                {formatMessage(messages.salaryAnalysis.results.wageGapLabel)}
              </Text>
              <Text variant="h3">{totals.wageGapPercent.toFixed(1)}%</Text>
            </Box>
          )}
        </Box>
      )}

      {result &&
        (outlierCount > 0 ? (
          <AlertMessage
            type="warning"
            title={formatMessage(
              messages.salaryAnalysis.results.outliersFoundTitle,
              { count: outlierCount },
            )}
            message={formatMessage(
              messages.salaryAnalysis.results.outliersFoundDescription,
            )}
          />
        ) : (
          <AlertMessage
            type="success"
            message={formatMessage(
              messages.salaryAnalysis.results.noOutliersFound,
            )}
          />
        ))}

      <OutlierGroupPanel
        application={application}
        outliers={result?.outliers ?? []}
        scoreBuckets={result?.baseSalaryByGenderAndScoreAll?.scoreBuckets ?? []}
        hidePostponeCheckbox={hidePostponeCheckbox}
        errors={errors}
        identifierForOrdinal={identifierForOrdinal}
        // Draft phase only: gives OutlierEditor its own form scope for
        // `outlierGroups` (not answers-backed pre-submit) without pulling
        // the postponed checkbox in — that stays on the true ambient form,
        // always (see the `postponed` useWatch above).
        outlierGroupsFormMethods={isDraftPhase ? draftForm : undefined}
      />
    </Box>
  )

  return body
}

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useFormContext, useWatch } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { YES } from '@island.is/application/core'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import {
  DraftErrorState,
  DraftLoadingState,
} from '../../components/DraftScreenState'
import { messages } from '../../lib/messages'
import { ApiActions, draftActionId } from '../../utils/constants'
import {
  buildOutlierClearCommands,
  buildOutlierSyncCommands,
  isOutlierGroupComplete,
  outlierGroupsWithMembers,
  unassignedOutlierOrdinals,
  withFallbackOutlierGroupNames,
  type OutlierGroupAnswer,
} from '../../utils/outlierGroups'
import { getProviderErrorMessage } from '../../utils/providerError'
import {
  getSalaryAnalysisResult,
  navigationAnswersForAnalysisResult,
  type AnalysisExternalData,
} from '../../utils/salaryAnalysisNavigation'
import type {
  DraftOutlierGroupDto,
  ReportEmployeeDto,
  ReportEmployeeRoleDto,
} from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync } from '../../utils/useDraftSync'
import { useSeedOnce } from '../../utils/useSeedOnce'
import { OutlierGroupPanel } from './OutlierGroupPanel'

interface Props extends FieldBaseProps {
  field: CustomField
}

type DraftOutlierFormValues = {
  salaryAnalysis: {
    outlierGroups: OutlierGroupAnswer[]
  }
}

export const SalaryImprovementPlan: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  errors,
  answerQuestions,
  setBeforeSubmitCallback,
  setSubmitButtonDisabled,
}) => {
  const hidePostponeCheckbox =
    field?.props && typeof field.props['hidePostponeCheckbox'] === 'boolean'
      ? (field.props['hidePostponeCheckbox'] as boolean)
      : false
  const isDraftPhase = !hidePostponeCheckbox
  const { formatMessage, lang: locale } = useLocale()
  const {
    content: outlierGroupsContent,
    loading: outlierGroupsLoading,
    hasError: outlierGroupsHasError,
    refetch: refetchOutlierGroups,
  } = useDraftQuery<{ groups: DraftOutlierGroupDto[] }>(
    application,
    draftActionId(ApiActions.listDraftOutlierGroups),
    'draftOutlierGroups',
  )
  const {
    content: employeesContent,
    loading: employeesLoading,
    hasError: employeesHasError,
    refetch: refetchEmployees,
  } = useDraftQuery<{ employees: ReportEmployeeDto[] }>(
    application,
    draftActionId(ApiActions.listDraftEmployees),
    'draftEmployees',
  )
  // Roles carry the job title; ReportEmployeeDto only carries the role's id.
  // Granted to the DRAFT role only, hence `enabled` — both review states
  // (POSTPONED and DRAFT_RETRY) show the column empty rather than firing a
  // provider they cannot call, which the controller rejects outright.
  const { content: rolesContent } = useDraftQuery<{
    roles: ReportEmployeeRoleDto[]
  }>(application, draftActionId(ApiActions.listDraftRoles), 'draftRoles', {
    enabled: isDraftPhase,
  })
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
      Promise.all([refetchOutlierGroups(options), refetchEmployees(options)]),
    [refetchOutlierGroups, refetchEmployees],
  )
  const { sync } = useDraftSync(application)
  const draftForm = useForm<DraftOutlierFormValues>({
    defaultValues: { salaryAnalysis: { outlierGroups: [] } },
  })
  const { control: ambientControl, setValue: setAmbientValue } =
    useFormContext()
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
    () => getSalaryAnalysisResult(application.externalData),
  )
  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  // answerQuestions is a fresh arrow on every shell render, so nothing that
  // dispatches through it may depend on its identity: the ANSWER re-renders the
  // shell, which hands down a new identity, which re-fires the caller. Keeping
  // it in a ref holds the latest callback without leaking that churn into deps.
  const answerQuestionsRef = useRef(answerQuestions)

  useEffect(() => {
    answerQuestionsRef.current = answerQuestions
  }, [answerQuestions])

  const handleAnalyze = useCallback(async () => {
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
                actionId: draftActionId(ApiActions.analyzeSalaryReport),
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
        answerQuestionsRef.current?.(
          navigationAnswersForAnalysisResult(salaryAnalysisResult.data, {
            resetReviewed: true,
          }),
        )
        setResult(salaryAnalysisResult.data)
      } else {
        setErrorMessage(getProviderErrorMessage(salaryAnalysisResult?.reason))
        setHasError(true)
      }
    } catch (error) {
      console.error(
        'Failed to analyze salary report for improvement plan',
        error,
      )
      setHasError(true)
    } finally {
      setIsAnalyzing(false)
    }
  }, [application.id, locale, updateApplicationExternalData])

  // Only when arriving without a result — e.g. straight into the POSTPONED
  // review, where nothing has been analysed in this session yet.
  useEffect(() => {
    if (result) return
    void handleAnalyze()
  }, [handleAnalyze, result])

  useSeedOnce(isDraftPhase && Boolean(content), () => {
    if (!content) return
    const employeeOrdinalById: Record<string, number> = Object.fromEntries(
      content.employees.map((e) => [e.id, e.ordinal]),
    )
    draftForm.reset({
      salaryAnalysis: {
        outlierGroups: content.outlierGroups.map((g) => ({
          id: g.id,
          name: g.name ?? '',
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
  })

  const roleTitleForOrdinal = useMemo(() => {
    const titleByRoleId = new Map(
      (rolesContent?.roles ?? []).map((role) => [role.id, role.title]),
    )
    const titleByOrdinal = new Map(
      (employeesContent?.employees ?? []).map((employee) => [
        employee.ordinal,
        titleByRoleId.get(employee.reportEmployeeRoleId),
      ]),
    )
    return (ordinal: number) => titleByOrdinal.get(ordinal)
  }, [employeesContent, rolesContent])

  const draftOutlierGroups =
    useWatch<DraftOutlierFormValues, 'salaryAnalysis.outlierGroups'>({
      name: 'salaryAnalysis.outlierGroups',
      control: draftForm.control,
    }) ?? []
  const ambientOutlierGroups =
    (useWatch({
      name: 'salaryAnalysis.outlierGroups',
      control: ambientControl,
    }) as OutlierGroupAnswer[] | undefined) ?? []
  const outlierGroups = isDraftPhase ? draftOutlierGroups : ambientOutlierGroups
  const currentOutliers = useMemo(() => result?.outliers ?? [], [result])
  const hasMinimumSetOutliers = currentOutliers.length > 0
  const unassignedOrdinals = useMemo(
    () => unassignedOutlierOrdinals(currentOutliers, outlierGroups),
    [currentOutliers, outlierGroups],
  )
  const groupsComplete = outlierGroups.every(isOutlierGroupComplete)
  const outlierPlanReviewed =
    hasMinimumSetOutliers &&
    (isPostponed || (unassignedOrdinals.length === 0 && groupsComplete))

  const fallbackGroupName = useCallback(
    (index: number) =>
      `${formatMessage(messages.salaryAnalysis.outlierGroup.groupHeading)} ${
        index + 1
      }`,
    [formatMessage],
  )

  useEffect(() => {
    if (!result) return
    const answers = {
      salaryAnalysis: {
        hasMinimumSetOutliers,
        outlierPlanReviewed: hasMinimumSetOutliers
          ? outlierPlanReviewed
          : false,
      },
    }
    setAmbientValue(
      'salaryAnalysis.hasMinimumSetOutliers',
      answers.salaryAnalysis.hasMinimumSetOutliers,
    )
    setAmbientValue(
      'salaryAnalysis.outlierPlanReviewed',
      answers.salaryAnalysis.outlierPlanReviewed,
    )
    answerQuestionsRef.current?.(answers)
  }, [hasMinimumSetOutliers, outlierPlanReviewed, result, setAmbientValue])

  useEffect(() => {
    if (!setSubmitButtonDisabled) return undefined

    setSubmitButtonDisabled(!outlierPlanReviewed)

    return () => setSubmitButtonDisabled(false)
  }, [outlierPlanReviewed, setSubmitButtonDisabled])

  useEffect(() => {
    if (isDraftPhase || isPostponed || !hasMinimumSetOutliers) return
    outlierGroups.forEach((group, index) => {
      if (!group.name?.trim()) {
        setAmbientValue(
          `salaryAnalysis.outlierGroups.${index}.name`,
          fallbackGroupName(index),
        )
      }
    })
  }, [
    fallbackGroupName,
    hasMinimumSetOutliers,
    isDraftPhase,
    isPostponed,
    outlierGroups,
    setAmbientValue,
  ])

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
      if (!result) {
        return [
          false,
          formatMessage(messages.salaryAnalysis.results.noAnalysisMessage),
        ]
      }

      if (currentOutliers.length === 0) {
        return [true, null]
      }

      if (!isPostponed) {
        if (unassignedOrdinals.length > 0) {
          return [
            false,
            formatMessage(
              messages.salaryAnalysis.outlierGroup.unassignedWarning,
            ),
          ]
        }

        if (!groupsComplete) {
          return [
            false,
            formatMessage(
              messages.salaryAnalysis.outlierGroup.incompleteGroupWarning,
            ),
          ]
        }
      }

      if (isDraftPhase) {
        if (!content) {
          return [false, formatMessage(messages.errors.draftLoadFailed)]
        }

        try {
          if (isPostponed) {
            // Postponing throws the grouping away rather than carrying it into
            // the POSTPONED state, where the plan is filled in from scratch
            // against the answers. Leaving it on the draft is what made the
            // submit 409 on DMR's group-delete guard.
            const clear = buildOutlierClearCommands(content)
            if (clear.employees.length > 0) {
              await sync({ employees: clear.employees })
            }
            if (clear.outlierGroups.length > 0) {
              await sync({ outlierGroups: clear.outlierGroups })
            }
            draftForm.setValue('salaryAnalysis.outlierGroups', [])
          } else {
            // Emptied groups are discarded rather than synced as memberless
            // rows on the draft.
            const finalGroups = outlierGroupsWithMembers(
              draftForm.getValues().salaryAnalysis.outlierGroups,
            )
            await sync(
              buildOutlierSyncCommands(
                content,
                withFallbackOutlierGroupNames(finalGroups, fallbackGroupName),
              ),
            )
          }
          await refetch({ silent: true })
        } catch (error) {
          console.error('Failed to sync salary outlier groups', error)
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
    result,
    currentOutliers,
    unassignedOrdinals,
    groupsComplete,
    isPostponed,
    isDraftPhase,
    content,
    draftForm,
    sync,
    refetch,
    formatMessage,
    fallbackGroupName,
  ])

  if (hasError) {
    return (
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
    )
  }

  if (isAnalyzing || !result) {
    return (
      <Box display="flex" justifyContent="center" paddingY={5}>
        <LoadingDots />
      </Box>
    )
  }

  if ((result.outliers?.length ?? 0) === 0) return null

  if (isDraftPhase && (outlierGroupsHasError || employeesHasError)) {
    return (
      <DraftErrorState
        onRetry={() => {
          refetchOutlierGroups()
          refetchEmployees()
        }}
      />
    )
  }

  if (isDraftPhase && (outlierGroupsLoading || employeesLoading || !content)) {
    return <DraftLoadingState />
  }

  return (
    <OutlierGroupPanel
      outliers={result.outliers ?? []}
      hidePostponeCheckbox={hidePostponeCheckbox}
      errors={errors}
      roleTitleForOrdinal={roleTitleForOrdinal}
      outlierGroupsFormMethods={isDraftPhase ? draftForm : undefined}
    />
  )
}

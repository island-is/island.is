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
import { ApiActions, draftActionId, States } from '../../utils/constants'
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
import { useDraftQueries } from '../../utils/useDraftQuery'
import { useDraftSync } from '../../utils/useDraftSync'
import { useSeedOnce } from '../../utils/useSeedOnce'
import { OutlierGroupPanel } from './OutlierGroupPanel'

interface Props extends FieldBaseProps {
  field: CustomField
}

// Shared fallback identity for the two group watches below: `?? []` would mint
// a new array on every render, and the plan mirror's effect keys on that value.
const NO_GROUPS: OutlierGroupAnswer[] = []

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
  // Not derived from hidePostponeCheckbox: that prop says whether to render a
  // checkbox, while this decides whether the analysis is ever recomputed. The
  // state is what actually governs that — DRAFT owns the live draft, the review
  // states own the submitted snapshot — and it is also what decides which draft
  // providers the role grants.
  const isDraftPhase = application.state === States.DRAFT
  const { formatMessage, lang: locale } = useLocale()
  // All three reads in one mutation — see the batching note on useDraftQueries.
  //
  // All three are also granted to the DRAFT role only, hence the shared
  // `enabled`: both review states (POSTPONED and DRAFT_RETRY) grant just the
  // analysis and comment providers, and the controller rejects the whole
  // mutation on the first actionId the role does not hold. They fall back to
  // the persisted snapshot instead, which is correct there — the draft is
  // already submitted, so there is nothing for it to be stale against.
  //
  // Roles are in the group because they carry the job title; ReportEmployeeDto
  // only carries the role's id.
  const {
    contents,
    loading: draftLoading,
    hasError: draftHasError,
    refetch,
  } = useDraftQueries<{
    draftOutlierGroups: { groups: DraftOutlierGroupDto[] }
    draftEmployees: { employees: ReportEmployeeDto[] }
    draftRoles: { roles: ReportEmployeeRoleDto[] }
  }>(
    application,
    {
      draftOutlierGroups: draftActionId(ApiActions.listDraftOutlierGroups),
      draftEmployees: draftActionId(ApiActions.listDraftEmployees),
      draftRoles: draftActionId(ApiActions.listDraftRoles),
    },
    { enabled: isDraftPhase },
  )
  const outlierGroupsContent = contents.draftOutlierGroups
  const employeesContent = contents.draftEmployees
  const rolesContent = contents.draftRoles
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

  // Draft phase only. The review states seed from the stored snapshot — the
  // analysis the report was submitted with, and the one the úrbótaáætlun
  // explains — so recomputing there would replace what the plan was written
  // against, and resetReviewed would clear outlierPlanReviewed underneath the
  // applicant.
  //
  // Held until the draft group has settled as well, so the two calls never
  // overlap: updateApplicationExternalData merges its results onto a snapshot
  // of the whole externalData column taken before its providers run, so two
  // calls in flight together lose whichever keys the loser added (see
  // useDraftQueries).
  useEffect(() => {
    if (!isDraftPhase || result || draftLoading) return
    void handleAnalyze()
  }, [draftLoading, handleAnalyze, isDraftPhase, result])

  // The draft stores members by employee id, the answers by ordinal — so the
  // employee list is what bridges the two, and both seeds below need the same
  // crossing.
  const outlierGroupAnswersFromDraft = useCallback((): OutlierGroupAnswer[] => {
    if (!content) return []
    const employeeOrdinalById: Record<string, number> = Object.fromEntries(
      content.employees.map((e) => [e.id, e.ordinal]),
    )
    return content.outlierGroups.map((g) => ({
      id: g.id,
      name: g.name ?? '',
      reason: g.reason ?? '',
      action: g.action ?? '',
      signatureName: g.signatureName ?? '',
      signatureRole: g.signatureRole ?? '',
      employeeOrdinals: g.memberEmployeeIds
        .map((id) => employeeOrdinalById[id])
        .filter((o): o is number => o !== undefined),
    }))
  }, [content])

  useSeedOnce(isDraftPhase && Boolean(content), () => {
    if (!content) return
    draftForm.reset({
      salaryAnalysis: { outlierGroups: outlierGroupAnswersFromDraft() },
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
    }) ?? NO_GROUPS
  const ambientOutlierGroups =
    (useWatch({
      name: 'salaryAnalysis.outlierGroups',
      control: ambientControl,
    }) as OutlierGroupAnswer[] | undefined) ?? NO_GROUPS
  const outlierGroups = isDraftPhase ? draftOutlierGroups : ambientOutlierGroups

  // DRAFT keeps the plan in the backend draft, and the form shell freezes its
  // copy of externalData at mount — so the overview screen, which reads
  // answers, has no way to see the plan otherwise. setValue only, deliberately:
  // no ANSWER dispatch per keystroke, and the screen's own submit carries these
  // values into both the persisted answers and the shell's copy (see
  // answerAndGoToNextScreen). The same mechanism the navigation flags rely on.
  useEffect(() => {
    if (!isDraftPhase) return
    setAmbientValue('salaryAnalysis.outlierGroups', draftOutlierGroups)
  }, [draftOutlierGroups, isDraftPhase, setAmbientValue])

  // The mirror above is what puts a DRAFT-phase plan into the answers, and it
  // only exists as of the postpone-flow change. Applications that left DRAFT
  // before it carry their groups on the stored draft snapshot alone, so
  // DRAFT_RETRY — which reads the plan from answers and never seeds from the
  // draft — would open an empty editor over a plan that exists, and
  // reviewOutlierPlanIsSubmittable would then refuse the submit.
  //
  // DRAFT_RETRY only, deliberately. POSTPONED is reached solely by postponing,
  // which clears the groups off the draft on the way out (see the isPostponed
  // branch in beforeSubmit) precisely so the plan is written from scratch there
  // — seeding it from a snapshot taken before that clear would resurrect a plan
  // the applicant chose to defer.
  useSeedOnce(
    application.state === States.DRAFT_RETRY &&
      Boolean(content) &&
      ambientOutlierGroups.length === 0,
    () => {
      const groups = outlierGroupAnswersFromDraft()
      if (groups.length === 0) return
      setAmbientValue('salaryAnalysis.outlierGroups', groups)
    },
  )

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
            if (clear.employees.length > 0 || clear.outlierGroups.length > 0) {
              await sync(clear)
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
        {isDraftPhase && (
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
        )}
      </Box>
    )
  }

  if (isAnalyzing || (!result && isDraftPhase)) {
    return (
      <Box display="flex" justifyContent="center" paddingY={5}>
        <LoadingDots />
      </Box>
    )
  }

  // The review states never fetch on their own, so a missing snapshot is
  // terminal there rather than pending — it needs the manual escape hatch, not
  // a spinner nothing will resolve.
  if (!result) {
    return (
      <Box marginBottom={3}>
        <AlertMessage
          type="info"
          title={formatMessage(messages.salaryAnalysis.results.unknownTitle)}
          message={formatMessage(
            messages.salaryAnalysis.results.noAnalysisMessage,
          )}
        />
        <Box marginTop={2}>
          <Button
            variant="ghost"
            size="small"
            icon="reload"
            onClick={handleAnalyze}
          >
            {formatMessage(messages.salaryAnalysis.results.recalculateButton)}
          </Button>
        </Box>
      </Box>
    )
  }

  if ((result.outliers?.length ?? 0) === 0) return null

  if (isDraftPhase && draftHasError) {
    return <DraftErrorState onRetry={() => refetch()} />
  }

  if (isDraftPhase && (draftLoading || !content)) {
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

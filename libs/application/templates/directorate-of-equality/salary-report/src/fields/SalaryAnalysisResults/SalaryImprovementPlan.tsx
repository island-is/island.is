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
import { formatEmployeeIdentifier } from '../../utils/employeeIdentifier'
import {
  buildOutlierSyncCommands,
  isOutlierGroupComplete,
  type OutlierGroupAnswer,
} from '../../utils/outlierGroups'
import { getProviderErrorMessage } from '../../utils/providerError'
import {
  getSalaryAnalysisResult,
  navigationAnswersForAnalysisResult,
  type AnalysisExternalData,
} from '../../utils/salaryAnalysisNavigation'
import type { DraftOutlierGroupDto, ReportEmployeeDto } from '../../utils/types'
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
  answerQuestionsRef.current = answerQuestions

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
            resetReviewed: false,
          }),
        )
        setResult(salaryAnalysisResult.data)
      } else {
        setErrorMessage(getProviderErrorMessage(salaryAnalysisResult?.reason))
        setHasError(true)
      }
    } catch {
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

  // Re-assert the navigation flags from a restored result so this subsection
  // stays reachable and the overview stays gated across a reload.
  useEffect(() => {
    if (!result) return
    answerQuestionsRef.current?.(
      navigationAnswersForAnalysisResult(result, { resetReviewed: false }),
    )
  }, [result])

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

  const identifierForOrdinal = useMemo(
    () => (ordinal: number) =>
      formatEmployeeIdentifier(application.id, ordinal),
    [application.id],
  )

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
          formatMessage(messages.salaryAnalysis.results.unknownMessage),
        ]
      }

      const currentOutliers = result.outliers ?? []
      if (currentOutliers.length === 0) {
        setAmbientValue('salaryAnalysis.hasMinimumSetOutliers', false)
        setAmbientValue('salaryAnalysis.outlierPlanReviewed', true)
        answerQuestions?.(
          navigationAnswersForAnalysisResult(result, { resetReviewed: false }),
        )
        return [true, null]
      }

      if (!isPostponed) {
        const assignedOrdinals = new Set(
          outlierGroups.flatMap((group) => group.employeeOrdinals),
        )
        const allOutliersAssigned = currentOutliers.every((outlier) =>
          assignedOrdinals.has(outlier.employeeOrdinal),
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

      const nameFor = (group: OutlierGroupAnswer, index: number) =>
        group.name?.trim() ||
        `${formatMessage(messages.salaryAnalysis.outlierGroup.groupHeading)} ${
          index + 1
        }`

      if (isDraftPhase) {
        if (!content) {
          return [false, formatMessage(messages.errors.draftLoadFailed)]
        }

        const finalGroups = draftForm
          .getValues()
          .salaryAnalysis.outlierGroups.map((group, index) => ({
            ...group,
            name: nameFor(group, index),
          }))
        try {
          await sync(buildOutlierSyncCommands(content, finalGroups))
          await refetch({ silent: true })
        } catch {
          return [false, formatMessage(messages.errors.draftSyncFailed)]
        }
      } else {
        outlierGroups.forEach((group, index) => {
          if (!group.name?.trim()) {
            setAmbientValue(
              `salaryAnalysis.outlierGroups.${index}.name`,
              nameFor(group, index),
            )
          }
        })
      }

      setAmbientValue('salaryAnalysis.hasMinimumSetOutliers', true)
      setAmbientValue('salaryAnalysis.outlierPlanReviewed', true)
      answerQuestions?.({
        salaryAnalysis: {
          hasMinimumSetOutliers: true,
          outlierPlanReviewed: true,
        },
      })
      return [true, null]
    })
  }, [
    setBeforeSubmitCallback,
    isAnalyzing,
    hasError,
    errorMessage,
    result,
    setAmbientValue,
    answerQuestions,
    isPostponed,
    outlierGroups,
    isDraftPhase,
    content,
    draftForm,
    sync,
    refetch,
    formatMessage,
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
      application={application}
      outliers={result.outliers ?? []}
      hidePostponeCheckbox={hidePostponeCheckbox}
      errors={errors}
      identifierForOrdinal={identifierForOrdinal}
      outlierGroupsFormMethods={isDraftPhase ? draftForm : undefined}
      hideHeading
    />
  )
}

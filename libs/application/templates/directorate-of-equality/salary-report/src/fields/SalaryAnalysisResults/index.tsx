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
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { ApiActions, draftActionId } from '../../utils/constants'
import {
  buildOutlierSyncCommands,
  isOutlierGroupComplete,
} from '../../utils/outlierGroups'
import type { OutlierGroupAnswer } from '../../utils/outlierGroups'
import { formatCurrency } from '../EmployeesEditor/utils'
import { formatEmployeeIdentifier } from '../../utils/employeeIdentifier'
import type { DraftOutlierGroupDto, ReportEmployeeDto } from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync } from '../../utils/useDraftSync'
import { OutlierGroupPanel } from './OutlierGroupPanel'
import { StatisticCard } from './StatisticsCard'

interface Props extends FieldBaseProps {
  field: CustomField
}

// Shape written by templateApiActionRunner.service.ts's buildExternalData —
// `reason` is already localized server-side (via formatMessage using the
// application's locale) before it reaches the client.
type AnalysisExternalData = {
  status?: 'success' | 'failure'
  data?: SalaryAnalysisResponseDto
  reason?: { title?: string; summary?: string } | string[]
}

const getErrorMessage = (
  reason: AnalysisExternalData['reason'],
): string | undefined => {
  if (!reason) return undefined
  if (Array.isArray(reason)) return reason.join(', ')
  return reason.summary || reason.title
}

// outlierGroups is DMR-synced pre-submit, unlike answers-backed `postponed`.
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
  // Draft phase: outlierGroups synced to DMR via a local form. Postponed review: answers-backed via the ambient form.
  const isDraftPhase = !hidePostponeCheckbox

  const { formatMessage, lang: locale } = useLocale()
  const { content: outlierGroupsContent, refetch: refetchOutlierGroups } =
    useDraftQuery<{ groups: DraftOutlierGroupDto[] }>(
      application,
      draftActionId(ApiActions.listDraftOutlierGroups),
      'draftOutlierGroups',
    )
  const { content: employeesContent, refetch: refetchEmployees } =
    useDraftQuery<{ employees: ReportEmployeeDto[] }>(
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

  // postponed stays answers-backed in both phases — read from the ambient form, never draftForm.
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
        setResult(salaryAnalysisResult.data)
      } else {
        setErrorMessage(getErrorMessage(salaryAnalysisResult?.reason))
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

  // Draft phase: seed the local outlier-group form, mapping member employee ids back to ordinals.
  useEffect(() => {
    if (!isDraftPhase || !content) return
    const employeeOrdinalById: Record<string, number> = Object.fromEntries(
      content.employees.map((e) => [e.id, e.ordinal]),
    )
    draftForm.reset({
      salaryAnalysis: {
        outlierGroups: content.outlierGroups.map((g, index) => ({
          id: g.id,
          name: formatMessage(
            messages.salaryAnalysis.outlierGroup.defaultGroupName,
            { index: index + 1 },
          ),
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

  const identifierForOrdinal = useMemo(
    () => (ordinal: number) =>
      formatEmployeeIdentifier(application.id, ordinal),
    [application.id],
  )

  const watchedOutlierGroups: OutlierGroupAnswer[] =
    useWatch({
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

      // Draft phase: persist the outlier grouping to DMR before continuing; postponed has nothing to sync.
      if (isDraftPhase && content) {
        const finalGroups = draftForm.getValues().salaryAnalysis.outlierGroups
        try {
          await sync(buildOutlierSyncCommands(content, finalGroups))
          // Refresh in case the applicant navigates back to an earlier screen this session.
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

      {totals && (
        <Box marginBottom={4}>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(messages.salaryAnalysis.results.totalsTitle)}
          </Text>
          <Box
            display="flex"
            columnGap={[0, 0, 0, 4]}
            rowGap={[2, 2, 2, 0]}
            marginTop={1}
            flexDirection={['column', 'column', 'column', 'row']}
          >
            <StatisticCard
              title={formatMessage(messages.salaryAnalysis.results.maleLabel)}
              content={formatCurrency(totals.maleAverageSalary)}
            />
            <StatisticCard
              title={formatMessage(messages.salaryAnalysis.results.femaleLabel)}
              content={formatCurrency(totals.femaleAverageSalary)}
            />

            {typeof totals.wageGapPercent === 'number' && (
              <StatisticCard
                title={formatMessage(
                  messages.salaryAnalysis.results.wageGapLabel,
                )}
                content={totals.wageGapPercent.toFixed(1) + '%'}
                color="purple"
              />
            )}
          </Box>
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
        // Draft phase only: gives OutlierEditor its own form scope for outlierGroups, separate from the ambient postponed checkbox.
        outlierGroupsFormMethods={isDraftPhase ? draftForm : undefined}
      />
    </Box>
  )

  return body
}

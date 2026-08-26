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
import { formatHourlyWage } from '../EmployeesEditor/utils'
import { deriveWageGapState, formatPercentMagnitude } from '../../utils/wageGap'
import { getProviderErrorMessage } from '../../utils/providerError'
import { formatEmployeeIdentifier } from '../../utils/employeeIdentifier'
import type { DraftOutlierGroupDto, ReportEmployeeDto } from '../../utils/types'
import { useDraftQuery } from '../../utils/useDraftQuery'
import { useDraftSync } from '../../utils/useDraftSync'
import { OutlierGroupPanel } from './OutlierGroupPanel'
import { StatisticCard } from './StatisticsCard'
import { SalaryDistributionChart } from './SalaryDistributionChart'

interface Props extends FieldBaseProps {
  field: CustomField
}

// Shape written by templateApiActionRunner.service.ts's buildExternalData —
// `reason` is already localized server-side (via formatMessage using the
// application's locale) before it reaches the client.
type AnalysisExternalData = {
  status?: 'success' | 'failure'
  data?: SalaryAnalysisResponseDto
  // Untyped on the wire — see getProviderErrorMessage.
  reason?: unknown
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
  goToScreen,
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
        setErrorMessage(getProviderErrorMessage(salaryAnalysisResult?.reason))
        setHasError(true)
      }
    } catch {
      setHasError(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Run automatically on every arrival at this screen — the applicant
  // shouldn't have to press a button to see results, and the draft can have
  // changed since the last visit (re-imported workbook, edited criteria,
  // edited employees) with nothing here to know that and invalidate a cached
  // `result`, so always recompute rather than trusting the last analysis.
  useEffect(() => {
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

      // A blank name still needs to reach the backend as something that tells
      // groups apart, so backfill it with the same numbered label the
      // accordion header already falls back to when displaying an empty name.
      const nameFor = (group: OutlierGroupAnswer, index: number) =>
        group.name?.trim() ||
        `${formatMessage(messages.salaryAnalysis.outlierGroup.groupHeading)} ${
          index + 1
        }`

      // Draft phase: persist the outlier grouping to DMR before continuing; postponed has nothing to sync.
      if (isDraftPhase && content) {
        const finalGroups = draftForm
          .getValues()
          .salaryAnalysis.outlierGroups.map((g, index) => ({
            ...g,
            name: nameFor(g, index),
          }))
        try {
          await sync(buildOutlierSyncCommands(content, finalGroups))
          // Refresh in case the applicant navigates back to an earlier screen this session.
          await refetch()
        } catch {
          return [false, formatMessage(messages.errors.draftSyncFailed)]
        }
      } else {
        // Postponed mode is answers-backed — write the fallback straight into
        // the ambient form so it's part of what gets persisted on submit.
        outlierGroups.forEach((g, index) => {
          if (!g.name?.trim()) {
            setAmbientValue(
              `salaryAnalysis.outlierGroups.${index}.name`,
              nameFor(g, index),
            )
          }
        })
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
    setAmbientValue,
  ])

  const totals = result?.regularHourlyWageByScoreAll?.totals
  const decomposition = result?.wageGapDecomposition
  const outlierCount = result?.outliers?.length ?? 0
  const gapState = deriveWageGapState(decomposition, outlierCount)
  const r = messages.salaryAnalysis.results

  // An overshooting set still gets the plain over-benchmark banner — the list
  // is the right list to account for. What differs is the note beneath it.
  const isOvershoot = gapState.kind === 'overBenchmarkOvershoots'
  const bannerKind: Exclude<typeof gapState.kind, 'overBenchmarkOvershoots'> =
    isOvershoot ? 'overBenchmark' : gapState.kind

  // Magnitude plus an explicit direction word — never the signed figure. The
  // old card rendered totals.wageGapPercent, the asymmetric (male − female) /
  // male form, which reads -4,2% when women out-earn men.
  const directionLabel = (direction?: 'FEMALE' | 'MALE' | 'NONE') =>
    formatMessage(
      direction === 'FEMALE'
        ? r.directionWomen
        : direction === 'MALE'
        ? r.directionMen
        : r.directionNone,
    )

  const gapContent = (
    percent: number,
    direction?: 'FEMALE' | 'MALE' | 'NONE',
  ) =>
    formatMessage(r.gapWithDirection, {
      value: formatPercentMagnitude(percent),
      direction: directionLabel(direction),
    })

  // Each tier is gated on its own availability flag: the raw gap and the
  // leiðréttur gap can be blocked independently.
  const showRawGap =
    decomposition?.rawGapAvailable === true &&
    typeof decomposition.rawGapPercent === 'number'
  const showAdjustedGap =
    decomposition?.oskyrtAvailable === true &&
    typeof decomposition.oskyrtPercent === 'number'

  // Soft warnings — the figures are computed but must be shown caveated. Each
  // code is named explicitly and anything unrecognised is dropped: DMR can add
  // a fourth code, and a catch-all would caption it "starfsmatsstig eru þau
  // sömu hjá öllum starfsmönnum", a specific claim that may be false.
  const warningMessages = (decomposition?.warnings ?? [])
    .map((warning) => {
      switch (warning) {
        case 'ROWS_EXCLUDED_NON_POSITIVE_WAGE':
          return formatMessage(r.warningRowsExcluded, {
            excluded: decomposition?.counts.excluded ?? 0,
          })
        case 'NO_SCORE_OVERLAP':
          return formatMessage(r.warningNoScoreOverlap)
        case 'NO_SCORE_VARIATION':
          return formatMessage(r.warningNoScoreVariation)
        default:
          return undefined
      }
    })
    .filter((message): message is string => Boolean(message))

  const body = (
    <Box>
      {isDraftPhase && (
        <Box marginBottom={3}>
          <Button
            variant="ghost"
            size="small"
            preTextIcon="arrowBack"
            disabled={isAnalyzing}
            onClick={() => goToScreen?.('criteriaMultiField')}
          >
            {formatMessage(messages.salaryAnalysis.results.reviewDataButton)}
          </Button>
        </Box>
      )}

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
            {formatMessage(r.meanHourlyWageGroupTitle)}
          </Text>
          <Box
            display="flex"
            columnGap={[0, 0, 0, 4]}
            rowGap={[2, 2, 2, 0]}
            marginTop={1}
            flexDirection={['column', 'column', 'column', 'row']}
          >
            <StatisticCard
              title={formatMessage(r.maleLabel)}
              content={formatHourlyWage(totals.maleAverageSalary)}
            />
            <StatisticCard
              title={formatMessage(r.femaleLabel)}
              content={formatHourlyWage(totals.femaleAverageSalary)}
            />
          </Box>
        </Box>
      )}

      {(showRawGap || showAdjustedGap) && decomposition && (
        <Box marginBottom={4}>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(r.wageGapGroupTitle)}
          </Text>
          <Box
            display="flex"
            columnGap={[0, 0, 0, 4]}
            rowGap={[2, 2, 2, 0]}
            marginTop={1}
            flexDirection={['column', 'column', 'column', 'row']}
          >
            {showRawGap && (
              <StatisticCard
                title={formatMessage(r.wageGapLabel)}
                content={gapContent(
                  decomposition.rawGapPercent as number,
                  decomposition.rawGapDirection,
                )}
              />
            )}
            {/* The figure actually tested against the benchmark — the raw gap
                beside it decides nothing. */}
            {showAdjustedGap && (
              <StatisticCard
                title={formatMessage(r.adjustedGapLabel)}
                content={gapContent(
                  decomposition.oskyrtPercent as number,
                  decomposition.oskyrtDirection,
                )}
                footnote={formatMessage(r.benchmarkFootnote, {
                  benchmark: formatPercentMagnitude(
                    decomposition.benchmarkPercent,
                  ),
                })}
                color="purple"
              />
            )}
          </Box>

          {warningMessages.length > 0 && (
            <Box marginTop={2}>
              <Text variant="small" fontWeight="semiBold">
                {formatMessage(r.warningsTitle)}
              </Text>
              {warningMessages.map((message) => (
                <Text key={message} variant="small">
                  {message}
                </Text>
              ))}
            </Box>
          )}
        </Box>
      )}

      {result && (
        <AlertMessage
          type={
            gapState.kind === 'withinBenchmark'
              ? 'success'
              : gapState.kind === 'notComputable' || gapState.kind === 'unknown'
              ? 'info'
              : 'warning'
          }
          title={formatMessage(r[`${bannerKind}Title`])}
          message={
            gapState.kind === 'withinBenchmark'
              ? formatMessage(r.withinBenchmarkMessage, {
                  benchmark: formatPercentMagnitude(gapState.benchmarkPercent),
                })
              : gapState.kind === 'overBenchmark' ||
                gapState.kind === 'overBenchmarkOvershoots'
              ? formatMessage(r.overBenchmarkMessage, {
                  benchmark: formatPercentMagnitude(gapState.benchmarkPercent),
                  count: gapState.outlierCount,
                })
              : gapState.kind === 'overBenchmarkNoList'
              ? formatMessage(
                  gapState.reason === 'noCarriers'
                    ? r.overBenchmarkNoCarriersMessage
                    : r.overBenchmarkAllOvershootMessage,
                  {
                    benchmark: formatPercentMagnitude(
                      gapState.benchmarkPercent,
                    ),
                  },
                )
              : gapState.kind === 'notComputable'
              ? // Each blocker is named explicitly. Falling through to the
                // male-cohort wording on an empty or unrecognised blocker list
                // would assert "engir karlar" about a company that may have
                // plenty.
                gapState.blockers.includes('EMPTY_FEMALE_COHORT')
                ? formatMessage(r.notComputableNoWomenMessage, {
                    male: gapState.counts.male,
                  })
                : gapState.blockers.includes('EMPTY_MALE_COHORT')
                ? formatMessage(r.notComputableNoMenMessage, {
                    female: gapState.counts.female,
                  })
                : formatMessage(r.unknownMessage)
              : formatMessage(r.unknownMessage)
          }
        />
      )}

      {isOvershoot && (
        <Box marginTop={2}>
          <AlertMessage
            type="info"
            title={formatMessage(r.overshootTitle)}
            message={formatMessage(r.overshootMessage)}
          />
        </Box>
      )}

      <SalaryDistributionChart
        dataPoints={result?.regularHourlyWageByScoreAll?.dataPoints ?? []}
        pooledFit={decomposition?.pooledFit}
      />

      <OutlierGroupPanel
        application={application}
        outliers={result?.outliers ?? []}
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

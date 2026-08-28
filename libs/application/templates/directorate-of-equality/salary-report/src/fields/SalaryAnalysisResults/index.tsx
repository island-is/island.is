import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
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
import { formatHourlyWage } from '../EmployeesEditor/utils'
import { deriveWageGapState, formatPercentMagnitude } from '../../utils/wageGap'
import { getProviderErrorMessage } from '../../utils/providerError'
import { formatEmployeeIdentifier } from '../../utils/employeeIdentifier'
import type { ReportEmployeeDto } from '../../utils/types'
import {
  getProviderSuccessData,
  type ProviderExternalData,
} from '../../utils/providerResult'
import { buildPayComponentsBreakdown } from '../../utils/payComponents'
import {
  getSalaryAnalysisResult,
  navigationAnswersForAnalysisResult,
  type AnalysisExternalData,
} from '../../utils/salaryAnalysisNavigation'
import { PayComponentsTable } from './PayComponentsTable'
import { PayDispersionTable } from './PayDispersionTable'
import { StatisticCard } from './StatisticsCard'
import { SalaryDistributionChart } from './SalaryDistributionChart'

type Props = FieldBaseProps

export const SalaryAnalysisResults: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  answerQuestions,
  setBeforeSubmitCallback,
  goToScreen,
}) => {
  const { formatMessage, lang: locale } = useLocale()
  const hidePostponeCheckbox =
    'props' in field &&
    typeof field.props?.['hidePostponeCheckbox'] === 'boolean'
      ? field.props['hidePostponeCheckbox']
      : false
  const isDraftPhase = !hidePostponeCheckbox
  /**
   * The employees list that arrived WITH the analysis now in `result`, and the
   * only source the pay-components table derives from.
   *
   * The list and the analysis are separate providers in one mutation, and
   * updateApplicationExternalData reports their statuses independently (its
   * endpoint never applies throwOnError). So the only way to know a component
   * average and a gap figure describe the same draft is to keep the list that
   * came back beside the analysis — a tracked "are they still in step?" flag
   * cannot hold that invariant, because any other writer of the list is free to
   * replace it without telling the flag.
   *
   * Which is why nothing else here fetches employees: handleAnalyze asks for
   * both legs on every arrival, so a standalone refresh has no reason to exist
   * and no way to pair a newer list with an older analysis.
   *
   * The review states are the one exception, and they seed from the stored
   * externalData instead. They are not granted the employee read at all, so a
   * fresh pair is unobtainable there — and unnecessary: neither POSTPONED nor
   * DRAFT_RETRY exposes a screen that can edit the employee list (DRAFT_RETRY's
   * editable sections are still empty placeholders), so the stored list is the
   * one the report was submitted with. Nothing to fall out of step with.
   */
  const [analyzedEmployees, setAnalyzedEmployees] = useState<
    ReportEmployeeDto[] | undefined
  >(() =>
    isDraftPhase
      ? undefined
      : getProviderSuccessData(
          application.externalData.draftEmployees as
            | ProviderExternalData<{ employees: ReportEmployeeDto[] }>
            | undefined,
        )?.employees,
  )
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasRequestedAnalysis, setHasRequestedAnalysis] = useState(() =>
    Boolean(getSalaryAnalysisResult(application.externalData)),
  )
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [result, setResult] = useState<SalaryAnalysisResponseDto | undefined>(
    () => getSalaryAnalysisResult(application.externalData),
  )

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )
  const { setValue } = useFormContext()

  // answerQuestions is a fresh arrow on every shell render, so it must never be
  // an effect dependency: the ANSWER it dispatches re-renders the shell, which
  // hands down a new identity, which re-fires the effect — a render loop. The
  // ref keeps the latest callback while the effect stays keyed to the result.
  const answerQuestionsRef = useRef(answerQuestions)

  useEffect(() => {
    answerQuestionsRef.current = answerQuestions
  }, [answerQuestions])

  /**
   * The navigation flags have to reach the FORM, not just the shell's answer
   * state. answerQuestions dispatches ANSWER, which updates the in-memory
   * answers — enough for the sidebar and for screen navigability to refresh
   * immediately — but the screen's own submit then merges its react-hook-form
   * payload over that, and RHF was reset from the *persisted* answers. So a
   * stale salaryAnalysis silently reverts the flag (and an undefined one wipes
   * the whole object), which sends the úrbótaáætlun screen non-navigable and
   * hands the applicant straight to the overview. It bites hardest on the
   * re-analysis path: editing the data upward has to reopen the plan screen
   * when the new result carries real lágmarksmengi outliers. setValue puts
   * those flags in the submitted data, so they survive that merge and persist
   * for the next visit.
   */
  const applyNavigationAnswers = useCallback(
    (analysis: SalaryAnalysisResponseDto, resetReviewed: boolean) => {
      const answers = navigationAnswersForAnalysisResult(analysis, {
        resetReviewed,
      })
      const { hasMinimumSetOutliers, outlierPlanReviewed } =
        answers.salaryAnalysis

      setValue('salaryAnalysis.hasMinimumSetOutliers', hasMinimumSetOutliers)
      // Absent means "leave it alone" — a plan already signed off must not be
      // reopened just because this screen re-mounted.
      if (typeof outlierPlanReviewed === 'boolean') {
        setValue('salaryAnalysis.outlierPlanReviewed', outlierPlanReviewed)
      }

      answerQuestionsRef.current?.(answers)
    },
    [setValue],
  )

  const handleAnalyze = useCallback(async () => {
    setHasRequestedAnalysis(true)
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
              // DRAFT is the only state whose role grants the employee read,
              // and the controller rejects the entire mutation on the first
              // ungranted actionId — so asking for it in the review states
              // takes the analysis down with it, leaving the screen on its
              // error banner with submission blocked.
              ...(isDraftPhase
                ? [
                    {
                      actionId: draftActionId(ApiActions.listDraftEmployees),
                      order: 1,
                    },
                  ]
                : []),
            ],
          },
          locale,
        },
      })
      const externalData =
        res.data?.updateApplicationExternalData.externalData ?? {}
      const salaryAnalysisResult = externalData.salaryAnalysisResult as
        | AnalysisExternalData
        | undefined
      const employees = getProviderSuccessData(
        externalData.draftEmployees as
          | ProviderExternalData<{ employees: ReportEmployeeDto[] }>
          | undefined,
      )
      const analysis = getProviderSuccessData(salaryAnalysisResult)

      // Both legs, or the table stands down: a new analysis with no list of its
      // own clears the stored one, since that list belongs to the analysis being
      // replaced. An analysis that did not land leaves the existing pair alone —
      // it still describes what is on screen.
      //
      // A failed employees leg is deliberately not surfaced as an error: the
      // analysis is the artifact this screen gates submission on and it stands
      // on its own, so a failed side-read must not discard it or block the
      // applicant. Only the derived table stands down.
      // Draft phase only: the review states never asked for the list, so an
      // absent one there says nothing about the pair and must not clear the
      // seed above.
      if (analysis && isDraftPhase) setAnalyzedEmployees(employees?.employees)

      if (analysis) {
        applyNavigationAnswers(analysis, true)
        setResult(analysis)
      } else {
        setErrorMessage(getProviderErrorMessage(salaryAnalysisResult?.reason))
        setHasError(true)
      }
    } catch (error) {
      console.error('Failed to analyze salary report', error)
      setHasError(true)
    } finally {
      setIsAnalyzing(false)
    }
  }, [
    application.id,
    applyNavigationAnswers,
    isDraftPhase,
    locale,
    updateApplicationExternalData,
  ])

  // Run automatically on every arrival at this screen — the applicant
  // shouldn't have to press a button to see results, and the draft can have
  // changed since the last visit (re-imported workbook, edited criteria,
  // edited employees) with nothing here to know that and invalidate a cached
  // `result`, so always recompute rather than trusting the last analysis.
  useEffect(() => {
    handleAnalyze()
  }, [handleAnalyze])

  // Re-assert the flags whenever a result appears, so the conditional
  // úrbótaáætlun subsection and the overview gate resolve on a restored draft
  // too — not just immediately after a fresh analysis.
  useEffect(() => {
    if (!result) return
    applyNavigationAnswers(result, false)
  }, [applyNavigationAnswers, result])

  const identifierForOrdinal = useMemo(
    () => (ordinal: number) =>
      formatEmployeeIdentifier(application.id, ordinal),
    [application.id],
  )

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

      applyNavigationAnswers(result, false)
      return [true, null]
    })
  }, [
    setBeforeSubmitCallback,
    isAnalyzing,
    hasError,
    errorMessage,
    formatMessage,
    result,
    applyNavigationAnswers,
  ])

  const totals = result?.regularHourlyWageByScoreAll?.totals
  const decomposition = result?.wageGapDecomposition
  const outlierCount = result?.outliers?.length ?? 0
  const gapState = deriveWageGapState(decomposition, outlierCount)
  const payComponents = useMemo(
    () =>
      analyzedEmployees ? buildPayComponentsBreakdown(analyzedEmployees) : null,
    [analyzedEmployees],
  )
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
    fractionDigits?: number,
  ) =>
    formatMessage(r.gapWithDirection, {
      value: formatPercentMagnitude(percent, fractionDigits),
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
  const rawGapSubtext =
    showRawGap && decomposition
      ? formatMessage(r.rawGapSubtext, {
          value: formatPercentMagnitude(
            decomposition.rawGapPercent as number,
            2,
          ),
          direction: directionLabel(decomposition.rawGapDirection),
        })
      : undefined
  const formatBenchmark = (value: number) => formatPercentMagnitude(value, 2)

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

      {(isAnalyzing || (!result && !hasRequestedAnalysis)) && (
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

      {!isAnalyzing && !hasError && !result && hasRequestedAnalysis && (
        <Box marginBottom={3}>
          <AlertMessage
            type="info"
            title={formatMessage(r.unknownTitle)}
            message={formatMessage(r.noAnalysisMessage)}
          />
          <Box marginTop={2}>
            <Button
              variant="ghost"
              size="small"
              icon="reload"
              onClick={handleAnalyze}
            >
              {formatMessage(r.recalculateButton)}
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

      {(showAdjustedGap || rawGapSubtext) && decomposition && (
        <Box marginBottom={4}>
          <Text variant="h4" marginBottom={2}>
            {formatMessage(r.wageGapGroupTitle)}
          </Text>

          {showAdjustedGap && (
            <Box
              display="flex"
              columnGap={[0, 0, 0, 4]}
              rowGap={[2, 2, 2, 0]}
              marginTop={1}
              marginBottom={1}
              flexDirection={['column', 'column', 'column', 'row']}
            >
              <StatisticCard
                title={formatMessage(r.adjustedGapLabel)}
                content={gapContent(
                  decomposition.oskyrtPercent as number,
                  decomposition.oskyrtDirection,
                  2,
                )}
                subtext={formatMessage(r.benchmarkFootnote, {
                  benchmark: formatBenchmark(decomposition.benchmarkPercent),
                })}
                color="purple"
              />
            </Box>
          )}

          {rawGapSubtext ? (
            <Text variant="small" color="dark350">
              {rawGapSubtext}
            </Text>
          ) : null}

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
        <Box marginBottom={isOvershoot ? 0 : 5}>
          <AlertMessage
            type={
              gapState.kind === 'withinBenchmark'
                ? 'success'
                : gapState.kind === 'notComputable' ||
                  gapState.kind === 'unknown'
                ? 'info'
                : 'warning'
            }
            title={formatMessage(r[`${bannerKind}Title`])}
            message={
              gapState.kind === 'withinBenchmark'
                ? formatMessage(r.withinBenchmarkMessage, {
                    benchmark: formatBenchmark(gapState.benchmarkPercent),
                  })
                : gapState.kind === 'overBenchmark' ||
                  gapState.kind === 'overBenchmarkOvershoots'
                ? formatMessage(r.overBenchmarkMessage, {
                    benchmark: formatBenchmark(gapState.benchmarkPercent),
                    count: gapState.outlierCount,
                  })
                : gapState.kind === 'overBenchmarkNoList'
                ? formatMessage(
                    gapState.reason === 'noCarriers'
                      ? r.overBenchmarkNoCarriersMessage
                      : r.overBenchmarkAllOvershootMessage,
                    {
                      benchmark: formatBenchmark(gapState.benchmarkPercent),
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
        </Box>
      )}

      {isOvershoot && (
        <Box marginTop={2} marginBottom={5}>
          <AlertMessage
            type="info"
            title={formatMessage(r.overshootTitle)}
            message={formatMessage(r.overshootMessage)}
          />
        </Box>
      )}

      <SalaryDistributionChart
        data={result?.regularHourlyWageByScoreAll}
        decomposition={decomposition}
        payDispersion={result?.payDispersion}
        identifierForOrdinal={identifierForOrdinal}
      />

      <PayComponentsTable data={payComponents} />

      <PayDispersionTable payDispersion={result?.payDispersion} />
    </Box>
  )

  return body
}

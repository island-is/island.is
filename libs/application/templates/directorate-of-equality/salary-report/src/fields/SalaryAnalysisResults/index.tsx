import { FC, useEffect, useMemo, useRef, useState } from 'react'
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
import { useDraftQuery } from '../../utils/useDraftQuery'
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
  answerQuestions,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage, lang: locale } = useLocale()
  const { content: employeesContent } = useDraftQuery<{
    employees: ReportEmployeeDto[]
  }>(
    application,
    draftActionId(ApiActions.listDraftEmployees),
    'draftEmployees',
  )
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [result, setResult] = useState<SalaryAnalysisResponseDto | undefined>(
    () => getSalaryAnalysisResult(application.externalData),
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
        answerQuestions?.(
          navigationAnswersForAnalysisResult(salaryAnalysisResult.data, {
            resetReviewed: true,
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
  }

  // Run automatically on arrival at this screen — the applicant shouldn't
  // have to press a button to see results. Only fires when there's no
  // existing result yet (e.g. from a prior visit to this screen).
  useEffect(() => {
    if (result) return
    handleAnalyze()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // answerQuestions is a fresh arrow on every shell render, so it must never be
  // an effect dependency: the ANSWER it dispatches re-renders the shell, which
  // hands down a new identity, which re-fires the effect — a render loop. The
  // ref keeps the latest callback while the effect stays keyed to the result.
  const answerQuestionsRef = useRef(answerQuestions)
  answerQuestionsRef.current = answerQuestions

  // Persist the navigation flags whenever a result appears, so the conditional
  // úrbótaáætlun subsection and the overview gate resolve on a restored draft
  // too — not just immediately after a fresh analysis.
  useEffect(() => {
    if (!result) return
    answerQuestionsRef.current?.(
      navigationAnswersForAnalysisResult(result, { resetReviewed: false }),
    )
  }, [result])

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
          formatMessage(messages.salaryAnalysis.results.unknownMessage),
        ]
      }

      answerQuestions?.(
        navigationAnswersForAnalysisResult(result, { resetReviewed: false }),
      )
      return [true, null]
    })
  }, [
    setBeforeSubmitCallback,
    isAnalyzing,
    hasError,
    errorMessage,
    formatMessage,
    result,
    answerQuestions,
  ])

  const totals = result?.regularHourlyWageByScoreAll?.totals
  const decomposition = result?.wageGapDecomposition
  const outlierCount = result?.outliers?.length ?? 0
  const gapState = deriveWageGapState(decomposition, outlierCount)
  const payComponents = useMemo(
    () =>
      employeesContent
        ? buildPayComponentsBreakdown(employeesContent.employees)
        : null,
    [employeesContent],
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

      {showAdjustedGap && decomposition && (
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
            {/* The figure actually tested against the benchmark — the raw gap
                now appears only as a quieter note on this card. */}
            <StatisticCard
              title={formatMessage(r.adjustedGapLabel)}
              content={gapContent(
                decomposition.oskyrtPercent as number,
                decomposition.oskyrtDirection,
                2,
              )}
              subtext={rawGapSubtext}
              footnote={formatMessage(r.benchmarkFootnote, {
                benchmark: formatPercentMagnitude(
                  decomposition.benchmarkPercent,
                ),
              })}
              color="purple"
            />
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
                    benchmark: formatPercentMagnitude(
                      gapState.benchmarkPercent,
                    ),
                  })
                : gapState.kind === 'overBenchmark' ||
                  gapState.kind === 'overBenchmarkOvershoots'
                ? formatMessage(r.overBenchmarkMessage, {
                    benchmark: formatPercentMagnitude(
                      gapState.benchmarkPercent,
                    ),
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

      <PayComponentsTable data={result ? payComponents : null} />

      <PayDispersionTable
        payDispersion={result?.payDispersion}
        identifierForOrdinal={identifierForOrdinal}
      />
    </Box>
  )

  return body
}

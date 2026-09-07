import { buildOverviewField, coreMessages } from '@island.is/application/core'
import type {
  FormText,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { messages } from '../lib/messages'
import {
  getAdjustedGap,
  getBenchmarkVerdict,
  isPostponeRequested,
  salaryAnalysisNeedsImprovementPlan,
} from '../utils/salaryAnalysisNavigation'
import { formatPercentMagnitude } from '../utils/wageGap'

/**
 * What the submission turns on, in three rows: the leiðréttur gap, whether it
 * clears the benchmark, and whether that obliges an úrbótaáætlun. The figures
 * themselves stay on the analysis screen — this is the confirmation, not a
 * second rendering of the analysis.
 *
 * Read from answers, never from externalData: the form shell freezes its copy
 * of externalData at mount, so a review screen reading it directly would show
 * page-load values in the very sitting the applicant ran the analysis. The
 * analysis screen mirrors both figures into answers for this reason.
 */
const gapValue = (answers: FormValue): FormText => {
  const gap = getAdjustedGap(answers)
  if (gap) {
    return {
      ...messages.overview.adjustedGapValue,
      values: {
        value: formatPercentMagnitude(gap.percent, 2),
        direction: gap.direction,
      },
    }
  }

  // No figure rather than a wrong one — the same two non-verdicts the
  // benchmark row keeps apart, for the same reason (see WageGapState).
  return getBenchmarkVerdict(answers) === 'notComputable'
    ? messages.overview.withinBenchmarkNotComputable
    : messages.overview.withinBenchmarkUnknown
}

const withinBenchmarkValue = (answers: FormValue): FormText => {
  switch (getBenchmarkVerdict(answers)) {
    case 'within':
      return coreMessages.radioYes
    case 'over':
      return coreMessages.radioNo
    case 'notComputable':
      return messages.overview.withinBenchmarkNotComputable
    default:
      return messages.overview.withinBenchmarkUnknown
  }
}

// showPostponeChoice: DRAFT only. The postpone answer is cleared once the
// applicant reaches the plan screen in a review state, so the row would read
// "Nei" there on an application that was, in fact, postponed.
export const buildAnalysisSummaryOverviewField = ({
  id,
  backId,
  showPostponeChoice = false,
}: {
  id: string
  backId?: string
  showPostponeChoice?: boolean
}) =>
  buildOverviewField({
    id,
    title: messages.overview.salaryAnalysisTitle,
    titleVariant: 'h3',
    ...(backId ? { backId } : {}),
    items: (answers, externalData): KeyValueItem[] => [
      {
        width: 'half',
        keyText: messages.overview.adjustedGapLabel,
        valueText: gapValue(answers),
      },
      {
        width: 'half',
        keyText: messages.overview.withinBenchmarkLabel,
        valueText: withinBenchmarkValue(answers),
      },
      {
        width: 'half',
        keyText: messages.overview.improvementPlanNeededLabel,
        valueText: salaryAnalysisNeedsImprovementPlan(answers, externalData)
          ? coreMessages.radioYes
          : coreMessages.radioNo,
      },
      // Only where there is a plan to postpone, and only while the choice is
      // still the applicant's to make.
      ...(showPostponeChoice &&
      salaryAnalysisNeedsImprovementPlan(answers, externalData)
        ? [
            {
              width: 'half' as const,
              keyText: messages.overview.postponeLabel,
              valueText: isPostponeRequested(answers)
                ? coreMessages.radioYes
                : coreMessages.radioNo,
            },
          ]
        : []),
    ],
  })

import { buildOverviewField, getValueViaPath } from '@island.is/application/core'
import type {
  FormText,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { messages } from '../lib/messages'
import type { OutlierGroupAnswer } from '../utils/outlierGroups'

/**
 * Reads the plan from answers in every phase.
 *
 * DRAFT edits the groups in the plan screen's own react-hook-form, backed by the
 * DMR draft rather than by answers — but that screen mirrors them into answers
 * as it goes, precisely so this recap can exist. Reading the stored
 * `draftOutlierGroups` provider instead would recap the plan as of page load:
 * the form shell freezes its copy of externalData at mount, so the sitting in
 * which the applicant writes the plan is the one sitting where that copy is
 * wrong.
 *
 * A group whose members were all freed carries no explanation and is dropped
 * before submission (see the service's editOutliers), so it must not be the
 * thing that makes a plan look filled in.
 */
export const outlierPlanOverviewItems = (answers: FormValue): KeyValueItem[] =>
  (
    getValueViaPath<OutlierGroupAnswer[]>(
      answers,
      'salaryAnalysis.outlierGroups',
    ) ?? []
  )
    .filter((group) => (group.employeeOrdinals?.length ?? 0) > 0)
    .flatMap((group, index) => [
      {
        width: 'full' as const,
        keyText: messages.salaryAnalysis.outlierGroup.groupHeading,
        valueText: group.name ? `${group.name}` : `${index + 1}`,
        // Divider above every group but the first, so groups read as visually
        // distinct blocks in the review list.
        ...(index > 0 && { lineAboveKeyText: true }),
      },
      {
        width: 'half' as const,
        keyText: messages.salaryAnalysis.outlierGroup.reasonLabel,
        valueText: group.reason ?? '',
      },
      {
        width: 'half' as const,
        keyText: messages.salaryAnalysis.outlierGroup.actionLabel,
        valueText: group.action ?? '',
      },
      {
        width: 'half' as const,
        keyText: messages.salaryAnalysis.outlierGroup.signatureNameLabel,
        valueText: group.signatureName ?? '',
      },
      {
        width: 'half' as const,
        keyText: messages.salaryAnalysis.outlierGroup.signatureRoleLabel,
        valueText: group.signatureRole ?? '',
      },
    ])

// hideIfEmpty so the block disappears entirely when there is no plan to show —
// a postponed report, or an analysis with no outliers — instead of leaving a
// heading over nothing. `title` is the caller's, so neither screen's copy owns
// the other's.
export const buildOutlierPlanOverviewField = ({
  id,
  title,
  backId,
}: {
  id: string
  title: FormText
  backId?: string
}) =>
  buildOverviewField({
    id,
    title,
    titleVariant: 'h3',
    hideIfEmpty: true,
    ...(backId ? { backId } : {}),
    items: outlierPlanOverviewItems,
  })

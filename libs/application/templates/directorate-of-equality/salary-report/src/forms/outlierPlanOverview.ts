import { buildOverviewField, getValueViaPath } from '@island.is/application/core'
import type {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { messages } from '../lib/messages'
import type { OutlierGroupAnswer } from '../utils/outlierGroups'
import {
  getProviderSuccessData,
  type ProviderExternalData,
} from '../utils/providerResult'
import type { DraftOutlierGroupDto } from '../utils/types'

type PlanGroup = Pick<
  OutlierGroupAnswer,
  'name' | 'reason' | 'action' | 'signatureName' | 'signatureRole'
> & { memberCount: number }

/**
 * The two screens that recap the plan read it from different places, because
 * the phases store it in different places: POSTPONED/DRAFT_RETRY edit the groups
 * as application answers, while DRAFT keeps them in the backend draft alone (the
 * plan screen's own react-hook-form syncs to DMR and re-reads the result into
 * `draftOutlierGroups`), so there the answers never hold them.
 *
 * Answers win when they hold anything: in the review phases they are the live
 * copy, and the stored `draftOutlierGroups` beside them is only as fresh as the
 * last sync.
 */
const planGroups = (
  answers: FormValue,
  externalData: ExternalData,
): PlanGroup[] => {
  const fromAnswers =
    getValueViaPath<OutlierGroupAnswer[]>(
      answers,
      'salaryAnalysis.outlierGroups',
    ) ?? []

  if (fromAnswers.length > 0) {
    return fromAnswers.map((group) => ({
      ...group,
      memberCount: group.employeeOrdinals?.length ?? 0,
    }))
  }

  const draftGroups =
    getProviderSuccessData(
      externalData?.['draftOutlierGroups'] as
        | ProviderExternalData<{ groups: DraftOutlierGroupDto[] }>
        | undefined,
    )?.groups ?? []

  return draftGroups.map((group) => ({
    name: group.name,
    reason: group.reason ?? undefined,
    action: group.action ?? undefined,
    signatureName: group.signatureName ?? undefined,
    signatureRole: group.signatureRole ?? undefined,
    memberCount: group.memberEmployeeIds.length,
  }))
}

// A group whose members were all freed by an edit has nothing to explain — the
// same reason isOutlierGroupComplete treats one as vacuously complete.
export const outlierPlanOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): KeyValueItem[] =>
  planGroups(answers, externalData)
    .filter((group) => group.memberCount > 0)
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
// heading over nothing.
export const buildOutlierPlanOverviewField = ({
  id,
  backId,
}: {
  id: string
  backId?: string
}) =>
  buildOverviewField({
    id,
    title: messages.postponed.reviewTitle,
    titleVariant: 'h3',
    hideIfEmpty: true,
    ...(backId ? { backId } : {}),
    items: outlierPlanOverviewItems,
  })

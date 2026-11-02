import {
  formatDate,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import type {
  MergedCase,
  WorkingCase,
} from '@island.is/judicial-system-web/src/components'
import type { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'

// The list renders the working case and, through
// ConnectedCaseFilesAccordionItem, each case merged into it. A merged case is
// fetched with fewer fields, so the type is what the two have in common. The
// two fields only the working case carries are optional: a merged case has no
// split cases of its own in the payload, and its indictment row is named
// without a date.
export type CaseFilesListCase = MergedCase &
  Partial<
    Pick<WorkingCase, 'caseSentToCourtDate' | 'splitCases' | 'indictmentHash'>
  >

// Every subpoena on the case and on the cases split from it, each with the
// defendant it was issued to. A defence user only gets the ones for
// defendants they are the confirmed defender of.
export const getVisibleSubpoenas = (
  workingCase: CaseFilesListCase,
  user?: User,
) => {
  const allSubpoenas = [
    ...(workingCase.defendants?.flatMap((defendant) =>
      (defendant.subpoenas ?? []).map((subpoena) => ({
        defendant,
        subpoena,
        caseId: workingCase.id,
      })),
    ) ?? []),
    ...(workingCase.splitCases?.flatMap((splitCase) =>
      (splitCase.defendants ?? []).flatMap((defendant) =>
        (defendant.subpoenas ?? []).map((subpoena) => ({
          defendant,
          subpoena,
          caseId: workingCase.id,
        })),
      ),
    ) ?? []),
  ]

  if (!isDefenceUser(user)) {
    return allSubpoenas
  }

  const normalizedUserNationalId = normalizeAndFormatNationalId(
    user?.nationalId ?? '',
  )

  return allSubpoenas.filter(
    ({ defendant }) =>
      defendant.isDefenderChoiceConfirmed &&
      defendant.defenderNationalId &&
      normalizedUserNationalId.includes(defendant.defenderNationalId),
  )
}

export const shouldShowPoliceDigitalCaseFilesSection = (
  user: User | undefined,
  digitalCaseFiles: unknown[] | null | undefined,
  digitalCaseFilesLoading: boolean,
): boolean =>
  (isProsecutionUser(user) ||
    isDistrictCourtUser(user) ||
    isCourtOfAppealsUser(user)) &&
  (digitalCaseFilesLoading || isNonEmptyArray(digitalCaseFiles))

// Temporary: for a few indictment cases the court uploaded the real case
// material as other documents, so defenders should not see the generated
// case-files-record PDF. Add case ids here (including any on dev used to
// verify) and remove the list once the exception is no longer needed.
export const CASE_IDS_HIDING_CASE_FILES_RECORD_FROM_DEFENDERS: string[] = [
  '6528b088-fdf0-4da5-be87-a01ad83bfa92',
  '3e72842f-577d-402f-ba42-88801d6f2fb9',
  'f06635a2-6935-4a65-ae7f-ae8ad0135609',
]

export const shouldHideCaseFilesRecordFromDefender = (
  caseId: string,
  user?: User,
  hiddenCaseIds: readonly string[] = CASE_IDS_HIDING_CASE_FILES_RECORD_FROM_DEFENDERS,
): boolean => isDefenceUser(user) && hiddenCaseIds.includes(caseId)

// Replacement uploads store `{ replaced: true }` in indictmentHash. Generated
// freezes do not, so they keep the sent-to-court date in the display name.
export const isReplacedIndictmentPdf = (
  indictmentHash?: string | null,
): boolean => {
  if (!indictmentHash) {
    return false
  }

  try {
    const parsed = JSON.parse(indictmentHash) as { replaced?: unknown }

    return parsed.replaced === true
  } catch {
    return false
  }
}

export const getIndictmentPdfDisplayName = (
  workingCase: CaseFilesListCase,
): string => {
  const withDate =
    !isReplacedIndictmentPdf(workingCase.indictmentHash) &&
    workingCase.caseSentToCourtDate
      ? ` ${formatDate(workingCase.caseSentToCourtDate)}`
      : ''

  return `Ákæra${withDate}.pdf`
}

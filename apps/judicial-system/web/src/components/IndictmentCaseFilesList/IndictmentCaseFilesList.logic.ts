import {
  formatDate,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isIndictmentPdfReplaceableState,
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

// Temporary one-off gate: only these case ids get the replace control in the UI.
// The API is unchanged; leave empty to hide the button everywhere.
export const REPLACE_INDICTMENT_PDF_CASE_ID_ALLOWLIST: readonly string[] = [
  'f8f48ddb-c765-4b51-aaeb-2353ceecd0a1',
]

// Shown once the generated Ákæra has been frozen to S3 (indictmentHash set),
// so a replace cannot race with the first getIndictmentPdf freeze.
export const shouldShowReplaceIndictmentPdf = (
  workingCase: CaseFilesListCase,
  user?: User,
  caseIdFromUrl?: string | null,
  allowlist: readonly string[] = REPLACE_INDICTMENT_PDF_CASE_ID_ALLOWLIST,
): boolean =>
  isProsecutionUser(user) &&
  isIndictmentPdfReplaceableState(workingCase.state) &&
  Boolean(workingCase.indictmentHash) &&
  typeof caseIdFromUrl === 'string' &&
  allowlist.includes(caseIdFromUrl)

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

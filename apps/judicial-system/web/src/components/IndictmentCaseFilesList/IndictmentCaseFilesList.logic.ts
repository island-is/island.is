import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
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
  Partial<Pick<WorkingCase, 'caseSentToCourtDate' | 'splitCases'>>

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

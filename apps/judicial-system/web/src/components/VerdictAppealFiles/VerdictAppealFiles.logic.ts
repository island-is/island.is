import {
  isPublicProsecutionOfficeUser,
  verdictAppealDeclarationFileCategories,
} from '@island.is/judicial-system/types'
import type {
  Case,
  CaseFile,
  CaseFileCategory,
  Defendant,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isMatchingAppealCaseFile } from '@island.is/judicial-system-web/src/utils/utils'

// Whether this user may open a verdict appeal file of one of the given
// categories. The public prosecution office sees every declaration - it acts on
// the appeal, and registers the ones that arrive by letter - and is not a
// prosecution user in the sense the shared appeal-file rule knows; everyone else
// is governed by that rule (prosecution sees all, a defender their own clients').
export const canViewVerdictAppealFile = (
  workingCase: Case,
  categories: CaseFileCategory[],
  file: Pick<CaseFile, 'category' | 'defendantId' | 'civilClaimantId'>,
  user: User | undefined,
): boolean =>
  (isPublicProsecutionOfficeUser(user) &&
    Boolean(file.category && categories.includes(file.category))) ||
  isMatchingAppealCaseFile(workingCase, categories, file, user)

export interface VerdictAppealFileGroup {
  defendant: Defendant
  files: CaseFile[]
}

/**
 * The appeal declaration and its accompanying files that this user may open,
 * grouped by the defendant they were filed for, in the order the defendants
 * appear on the case and the order the files were filed. A defence user only
 * sees the files of the defendants they represent, the same rule that governs
 * every other party appeal file.
 */
export const getVerdictAppealFileGroups = (
  workingCase: Case,
  user: User | undefined,
): VerdictAppealFileGroup[] => {
  const declarationFiles = (workingCase.caseFiles ?? [])
    .filter((file) =>
      canViewVerdictAppealFile(
        workingCase,
        verdictAppealDeclarationFileCategories,
        file,
        user,
      ),
    )
    .sort(
      (a, b) =>
        new Date(a.created ?? 0).getTime() - new Date(b.created ?? 0).getTime(),
    )

  return (workingCase.defendants ?? []).flatMap((defendant) => {
    const files = declarationFiles.filter(
      (file) => file.defendantId === defendant.id,
    )

    return files.length > 0 ? [{ defendant, files }] : []
  })
}

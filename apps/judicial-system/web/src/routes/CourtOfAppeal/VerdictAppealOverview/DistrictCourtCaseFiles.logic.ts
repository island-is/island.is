import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'

// What the district court decided and what it recorded - the verdict itself,
// and the court record of the sessions that produced it. DEFENDANT_RULING is a
// verdict too, the one that dismisses or drops the case against a single
// defendant, so it belongs beside RULING rather than in a section of its own.
const districtCourtFileCategories = [
  CaseFileCategory.RULING,
  CaseFileCategory.DEFENDANT_RULING,
  CaseFileCategory.COURT_RECORD,
]

/**
 * The district court documents the Court of Appeals is shown on the verdict
 * appeal overview: the verdict and the court record, and nothing else.
 *
 * Deliberately far narrower than IndictmentCaseFilesList, which the other
 * overviews use - that one shows the whole case file, down to criminal records
 * and the parties' own uploads. This court is reading an appeal of a verdict,
 * so the design gives it the verdict and the record of how it came about; the
 * rest stays at the district court.
 */
export const getDistrictCourtCaseFiles = (
  theCase: Pick<WorkingCase, 'caseFiles'>,
): CaseFile[] =>
  (theCase.caseFiles ?? [])
    .filter(
      (file) =>
        file.category && districtCourtFileCategories.includes(file.category),
    )
    .sort(
      (a, b) =>
        new Date(a.created ?? 0).getTime() - new Date(b.created ?? 0).getTime(),
    )

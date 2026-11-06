import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'

import { getDistrictCourtCaseFiles } from './DistrictCourtCaseFiles.logic'

const file = (
  id: string,
  category: CaseFileCategory,
  created = '2026-06-01T00:00:00.000Z',
): CaseFile => ({ id, name: `${id}.pdf`, category, created } as CaseFile)

const names = (caseFiles: CaseFile[]) =>
  getDistrictCourtCaseFiles({ caseFiles } as Pick<
    WorkingCase,
    'caseFiles'
  >).map((f) => f.id)

describe('getDistrictCourtCaseFiles', () => {
  it('has nothing to show on a case with no files', () => {
    expect(names([])).toEqual([])
  })

  it('shows the verdict and the court record', () => {
    expect(
      names([
        file('ruling', CaseFileCategory.RULING),
        file('courtRecord', CaseFileCategory.COURT_RECORD),
      ]),
    ).toEqual(['ruling', 'courtRecord'])
  })

  // A verdict dismissing the case against one defendant is a verdict too.
  it('counts a defendant ruling as one of them', () => {
    expect(
      names([file('defendantRuling', CaseFileCategory.DEFENDANT_RULING)]),
    ).toEqual(['defendantRuling'])
  })

  // This is the whole point of the section: the court of appeals is reading an
  // appeal of a verdict, so the rest of the case file stays at the district
  // court. Every category below reaches this page on other overviews.
  it('leaves the rest of the case file out', () => {
    expect(
      names([
        file('appealRuling', CaseFileCategory.APPEAL_RULING),
        file('caseFileRecord', CaseFileCategory.CASE_FILE_RECORD),
        file('criminalRecord', CaseFileCategory.CRIMINAL_RECORD),
        file('costBreakdown', CaseFileCategory.COST_BREAKDOWN),
        file('caseFile', CaseFileCategory.CASE_FILE),
        file('prosecutorFile', CaseFileCategory.PROSECUTOR_CASE_FILE),
        file('defendantFile', CaseFileCategory.DEFENDANT_CASE_FILE),
        file('civilClaim', CaseFileCategory.CIVIL_CLAIM),
        file('rulingOrder', CaseFileCategory.COURT_INDICTMENT_RULING_ORDER),
        file('declaration', CaseFileCategory.DEFENDANT_APPEAL_DECLARATION),
      ]),
    ).toEqual([])
  })

  it('reads oldest first', () => {
    expect(
      names([
        file('second', CaseFileCategory.COURT_RECORD, '2026-06-02T00:00:00Z'),
        file('first', CaseFileCategory.RULING, '2026-06-01T00:00:00Z'),
      ]),
    ).toEqual(['first', 'second'])
  })
})

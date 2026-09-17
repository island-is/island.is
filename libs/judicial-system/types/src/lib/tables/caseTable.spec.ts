import { InstitutionType } from '../institution'
import { InstitutionUser, UserRole } from '../user'
import { caseTables, getCaseTableType } from './caseTable'
import { getCaseTableGroups } from './caseTableGroup'
import { CaseTableType } from './caseTableTypes'

describe('defence case tables', () => {
  const defenceUser = { role: UserRole.DEFENDER } as InstitutionUser

  it('returns the defence table groups for defence users', () => {
    const groups = getCaseTableGroups(defenceUser)

    expect(groups.map((g) => g.title)).toEqual(['Rannsóknarmál', 'Sakamál'])
    expect(groups.flatMap((g) => g.tables.map((t) => t.type))).toEqual([
      CaseTableType.DEFENCE_REQUEST_CASES_IN_PROGRESS,
      CaseTableType.DEFENCE_REQUEST_CASES_APPEALED,
      CaseTableType.DEFENCE_REQUEST_CASES_COMPLETED,
      CaseTableType.DEFENCE_INDICTMENTS_IN_PROGRESS,
      CaseTableType.DEFENCE_INDICTMENTS_APPEALED,
      CaseTableType.DEFENCE_INDICTMENTS_COMPLETED,
    ])
  })

  it('resolves defence table types from routes', () => {
    expect(getCaseTableType(defenceUser, 'sakamal-i-kaeruferli')).toBe(
      CaseTableType.DEFENCE_INDICTMENTS_APPEALED,
    )
    expect(getCaseTableType(defenceUser, 'rannsoknarmal-i-vinnslu')).toBe(
      CaseTableType.DEFENCE_REQUEST_CASES_IN_PROGRESS,
    )
  })

  it('does not use the my cases filter', () => {
    const groups = getCaseTableGroups(defenceUser)

    for (const table of groups.flatMap((g) => g.tables)) {
      expect(caseTables[table.type].hasMyCasesFilter).toBe(false)
    }
  })

  it('shows the appeal state column without duplicating it in the ruling decision column on appealed indictment tables', () => {
    for (const type of [
      CaseTableType.DEFENCE_INDICTMENTS_APPEALED,
      CaseTableType.PROSECUTION_INDICTMENTS_APPEALED,
    ]) {
      expect(caseTables[type].columnKeys).toContain('appealCaseState')
      expect(caseTables[type].columnKeys).toContain(
        'indictmentRulingDecisionWithoutAppealState',
      )
      expect(caseTables[type].columnKeys).not.toContain(
        'indictmentRulingDecision',
      )
    }
  })
})

describe('court of appeals verdict appeal tables', () => {
  const courtOfAppealsUser = {
    role: UserRole.COURT_OF_APPEALS_JUDGE,
    institution: { type: InstitutionType.COURT_OF_APPEALS },
  } as InstitutionUser

  it('offers the appealed verdicts group alongside the appealed rulings one', () => {
    const groups = getCaseTableGroups(courtOfAppealsUser)

    expect(groups.map((g) => g.title)).toEqual([
      'Kærð sakamál',
      'Áfrýjuð sakamál',
    ])
    expect(groups.flatMap((g) => g.tables.map((t) => t.type))).toEqual([
      CaseTableType.COURT_OF_APPEALS_CASES_IN_PROGRESS,
      CaseTableType.COURT_OF_APPEALS_CASES_COMPLETED,
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS,
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED,
    ])
  })

  // Routes are matched across every group this user has, so the verdict appeal
  // lists cannot reuse the routes of the ruling appeal lists.
  it('resolves each table from a route of its own', () => {
    const routes = getCaseTableGroups(courtOfAppealsUser).flatMap((g) =>
      g.tables.map((t) => t.route),
    )

    expect(new Set(routes).size).toBe(routes.length)
    expect(getCaseTableType(courtOfAppealsUser, 'afryjud-mal-i-vinnslu')).toBe(
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS,
    )
    expect(getCaseTableType(courtOfAppealsUser, 'afryjud-afgreidd-mal')).toBe(
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED,
    )
    expect(getCaseTableType(courtOfAppealsUser, 'mal-i-vinnslu')).toBe(
      CaseTableType.COURT_OF_APPEALS_CASES_IN_PROGRESS,
    )
  })

  // The verdict appeal columns read the case's verdict appeal; reusing the
  // appealCase-backed columns would show the ruling appeal instead.
  it('reads the verdict appeal rather than the ruling appeal', () => {
    const inProgress =
      caseTables[CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS]
    const completed =
      caseTables[CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED]

    expect(inProgress.columnKeys).toEqual([
      'caseNumber',
      'defendants',
      'caseType',
      'districtCourtRulingDate',
      'verdictAppealAppellant',
      'verdictAppealState',
      'verdictAppealHead',
    ])
    expect(completed.columnKeys).toEqual([
      'caseNumber',
      'defendants',
      'caseType',
      'verdictAppealAppellant',
      'verdictAppealCompletedDate',
      'verdictAppealResult',
    ])

    for (const table of [inProgress, completed]) {
      expect(table.columnKeys).not.toContain('appealState')
      expect(table.columnKeys).not.toContain('appealCaseState')
      expect(table.columnKeys).not.toContain('courtOfAppealsHead')
    }
  })

  it('titles the columns as the design does', () => {
    expect(
      caseTables[
        CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS
      ].columns.map((c) => c.title),
    ).toEqual([
      'Málsnúmer',
      'Varnaraðili',
      'Tegund',
      'Dómur héraðsdóms',
      'Áfrýjað af',
      'Staða',
      'Dómsformaður',
    ])
    expect(
      caseTables[
        CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED
      ].columns.map((c) => c.title),
    ).toEqual([
      'Málsnúmer',
      'Varnaraðili',
      'Tegund',
      'Áfrýjað af',
      'Máli lokið',
      'Niðurstaða',
    ])
  })
})

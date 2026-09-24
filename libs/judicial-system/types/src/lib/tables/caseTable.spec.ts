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
      'verdictAppealCaseNumber',
      'defendants',
      'caseType',
      'districtCourtRulingDate',
      'verdictAppealAppellant',
      'verdictAppealState',
      'verdictAppealHead',
    ])
    expect(completed.columnKeys).toEqual([
      'verdictAppealCaseNumber',
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
      // caseNumber's generator reads the ruling appeal, so these lists would
      // show no appeal case number at all - or, on a case that had both, the
      // wrong one.
      expect(table.columnKeys).not.toContain('caseNumber')
    }
  })

  // The group overview renders these straight from the group definition, so the
  // card copy is only ever as right as this is.
  it('describes the tables as the design does', () => {
    const group = getCaseTableGroups(courtOfAppealsUser)[1]

    expect(
      group.tables.map((t) => [t.title, t.description, t.includeCounter]),
    ).toEqual([
      ['Mál í vinnslu', 'Áfrýjuð sakamál.', true],
      ['Afgreidd mál', 'Mál sem búið er að ljúka.', undefined],
    ])
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

describe('public prosecution case tables', () => {
  // Role PROSECUTOR at the public prosecutor's office - the prosecutors
  // themselves, not the office staff, who are PUBLIC_PROSECUTOR_STAFF and get
  // their own groups.
  const publicProsecutionUser = {
    role: UserRole.PROSECUTOR,
    institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
  } as InstitutionUser

  it('offers the appealed cases list second in the indictments group', () => {
    const indictments = getCaseTableGroups(publicProsecutionUser)[1]

    expect(indictments.title).toBe('Sakamál')
    expect(indictments.tables.map((t) => t.type)).toEqual([
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW,
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED,
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_REVIEWED,
      CaseTableType.PROSECUTION_INDICTMENTS_IN_DRAFT,
      CaseTableType.PROSECUTION_INDICTMENTS_WAITING_FOR_CONFIRMATION,
      CaseTableType.PROSECUTION_INDICTMENTS_IN_PROGRESS,
      CaseTableType.PROSECUTION_INDICTMENTS_APPEALED,
      CaseTableType.PROSECUTION_INDICTMENTS_COMPLETED,
    ])
  })

  it('describes the appealed cases card as the design does', () => {
    const table = getCaseTableGroups(publicProsecutionUser)[1].tables[1]

    expect([table.title, table.description, table.includeCounter]).toEqual([
      'Áfrýjuð mál',
      'Mál sem hefur verið áfrýjað.',
      true,
    ])
  })

  // Routes are matched across every group this user has, and this one inherits
  // the ordinary prosecutor's tables wholesale, so a clash is easy to make.
  it('resolves each table from a route of its own', () => {
    const routes = getCaseTableGroups(publicProsecutionUser).flatMap((g) =>
      g.tables.map((t) => t.route),
    )

    expect(new Set(routes).size).toBe(routes.length)
    expect(getCaseTableType(publicProsecutionUser, 'afryjud-sakamal')).toBe(
      CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED,
    )
  })

  // The office's list of the same name is the one the columns were borrowed
  // from, and the ticket leaves tidying them to a later one.
  it('borrows the columns of the office list of the same name', () => {
    expect(
      caseTables[CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED]
        .columnKeys,
    ).toEqual(
      caseTables[CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEALED]
        .columnKeys,
    )
  })

  // The ordinary prosecutor's groups are spread into this user's, so adding a
  // table to the wrong file would hand it to every district prosecutor too.
  it('does not offer the appealed cases list to ordinary prosecutors', () => {
    const prosecutorUser = {
      role: UserRole.PROSECUTOR,
      institution: { type: InstitutionType.DISTRICT_PROSECUTORS_OFFICE },
    } as InstitutionUser

    expect(
      getCaseTableGroups(prosecutorUser).flatMap((g) =>
        g.tables.map((t) => t.type),
      ),
    ).not.toContain(CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED)
  })
})

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
      CaseTableType.DEFENCE_INDICTMENTS_VERDICT_APPEALED,
      CaseTableType.DEFENCE_INDICTMENTS_COMPLETED,
    ])
  })

  it('describes the appealed verdicts card as the design does', () => {
    const table = getCaseTableGroups(defenceUser)[1].tables[2]

    expect([
      table.route,
      table.title,
      table.description,
      table.includeCounter,
    ]).toEqual([
      'sakamal-i-afryjunarferli',
      'Sakamál í áfrýjunarferli',
      'Dómar í sakamálum sem eru í áfrýjunarferli hjá Landsrétti.',
      true,
    ])
    expect(getCaseTableType(defenceUser, 'sakamal-i-afryjunarferli')).toBe(
      CaseTableType.DEFENCE_INDICTMENTS_VERDICT_APPEALED,
    )
  })

  // An appealed verdict stays among the completed cases, and its court of
  // appeals number has to show there as it does on the appealed verdicts list.
  it('shows the number of either appeal on the completed indictments list', () => {
    const table = caseTables[CaseTableType.DEFENCE_INDICTMENTS_COMPLETED]

    expect(table.columnKeys[0]).toBe('latestAppealCaseNumber')
    expect(table.columns[0].title).toBe('Málsnúmer')
  })

  // The ruling appeal columns share titles with these - "Málsnúmer", "Staða" -
  // so the keys are what shows the list reads the verdict appeal.
  it('reads the verdict appeal on the appealed verdicts list', () => {
    const table = caseTables[CaseTableType.DEFENCE_INDICTMENTS_VERDICT_APPEALED]

    expect(table.title).toBe('Sakamál í áfrýjunarferli')
    expect(table.columnKeys).toEqual([
      'verdictAppealCaseNumber',
      'defendants',
      'caseType',
      'verdictAppealDate',
      'verdictAppealProgress',
      'verdictAppealCourtSession',
    ])
    expect(table.columns.map((column) => column.title)).toEqual([
      'Málsnúmer',
      'Varnaraðili',
      'Tegund',
      'Áfrýjað',
      'Staða',
      'Fyrirtaka',
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
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_READY_TO_COMPLETE,
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
    expect(
      getCaseTableType(courtOfAppealsUser, 'afryjud-mal-i-domsuppkvadningu'),
    ).toBe(CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_READY_TO_COMPLETE)
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
      ['Mál í dómsuppkvaðningu', 'Áfrýjuð sakamál sem á eftir að ljúka.', true],
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

  // The appeals the court has confirmed and has still to complete. The columns
  // read the verdict appeal, for the same reason as on the other two lists.
  it('lists the appeals to complete with the columns the design asks for', () => {
    const readyToComplete =
      caseTables[
        CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_READY_TO_COMPLETE
      ]

    expect(readyToComplete.title).toBe('Mál í dómsuppkvaðningu')
    expect(readyToComplete.hasMyCasesFilter).toBe(false)
    expect(readyToComplete.columnKeys).toEqual([
      'verdictAppealCaseNumber',
      'defendants',
      'caseType',
      'verdictAppealRulingDate',
      'verdictAppealRulingType',
      'verdictAppealHead',
    ])
    expect(readyToComplete.columns.map((c) => c.title)).toEqual([
      'Málsnúmer',
      'Varnaraðili',
      'Tegund',
      'Dómsuppkvaðning',
      'Staða',
      'Dómsformaður',
    ])
  })

  it('offers the list to complete only to the court of appeals', () => {
    const districtCourtJudge = {
      role: UserRole.DISTRICT_COURT_JUDGE,
      institution: { type: InstitutionType.DISTRICT_COURT },
    } as InstitutionUser

    expect(
      getCaseTableGroups(districtCourtJudge).flatMap((g) =>
        g.tables.map((t) => t.type),
      ),
    ).not.toContain(
      CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_READY_TO_COMPLETE,
    )
    expect(
      getCaseTableType(districtCourtJudge, 'afryjud-mal-i-domsuppkvadningu'),
    ).toBeUndefined()
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

  // The order the design settled on: the result reads last, after the deadline
  // it qualifies.
  it('titles the review list columns as the design does', () => {
    expect(
      caseTables[
        CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW
      ].columns.map((column) => column.title),
    ).toEqual(['Málsnúmer', 'Varnaraðili', 'Tegund', 'Frestur', 'Niðurstaða'])
  })

  // The ticket asks for the same column the reviewed list uses, not one that
  // merely looks like it - the title is shared by three column keys, so
  // matching on the title alone would let the two lists drift into showing the
  // result differently.
  it('shows the result with the same column the reviewed list uses', () => {
    const inReview =
      caseTables[CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW]
        .columnKeys
    const reviewed =
      caseTables[CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_REVIEWED]
        .columnKeys

    expect(inReview[inReview.length - 1]).toBe('indictmentRulingDecision')
    expect(reviewed).toContain('indictmentRulingDecision')
  })

  it('titles the appealed list columns as the design does', () => {
    expect(
      caseTables[
        CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED
      ].columns.map((column) => column.title),
    ).toEqual([
      'Málsnúmer',
      'Varnaraðili',
      'Saksóknari',
      'Áfrýjað af',
      'Áfrýjað',
      'Staða',
      'Fyrirtaka',
    ])
  })

  // The list is about the verdict appeal, so every appeal column has to read
  // that one. The ruling appeal columns share titles with these - "Málsnúmer",
  // "Áfrýjað af", "Staða" - so the titles alone would not catch a list showing
  // the number or the state of the wrong appeal.
  it('reads the verdict appeal on the appealed list, not the ruling appeal', () => {
    const columnKeys =
      caseTables[CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED]
        .columnKeys

    expect(columnKeys).toEqual([
      'verdictAppealCaseNumber',
      'defendants',
      'appealProsecutor',
      'verdictAppealAppellantTag',
      'verdictAppealDate',
      'verdictAppealProgress',
      'verdictAppealCourtSession',
    ])
  })

  // Every prosecutor at the office sees every appealed verdict, so the filter
  // is how one of them finds the appeals that are theirs to argue. The two
  // review lists are the user's own work already and have nothing to narrow.
  it('offers the my cases filter on the appealed list only', () => {
    expect(
      caseTables[CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED]
        .hasMyCasesFilter,
    ).toBe(true)
    expect(
      caseTables[CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW]
        .hasMyCasesFilter,
    ).toBe(false)
    expect(
      caseTables[CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_REVIEWED]
        .hasMyCasesFilter,
    ).toBe(false)
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

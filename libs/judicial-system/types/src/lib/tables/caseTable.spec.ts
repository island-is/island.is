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

import {
  captureSql,
  initCaseTableModels,
} from '../../case-table/caseTable.sqlProbe'
import { Case } from '../models/case.model'
import {
  caseInclude,
  getLimitedAccessCaseInclude,
} from '../types/caseRepository.types'

// The ruling order appeals are loaded by a query of their own, so nothing in
// the case query may be joined under their alias. An include object shared
// between the appeal case includes breaks this: the assistant's institution is
// joined against whichever appeal case include claimed the object last, which
// is the one that is not in the query.
describe('case includes - appeal assistant joins', () => {
  beforeAll(() => {
    initCaseTableModels()
  })

  it.each([
    ['case include', () => caseInclude],
    ['limited access case include', () => getLimitedAccessCaseInclude()],
  ])(
    'joins the institution of each appeal assistant under its own appeal case in the %s',
    async (_, getInclude) => {
      const sql = await captureSql(() =>
        Case.findOne({ where: { id: 'case-id' }, include: getInclude() }),
      )

      expect(sql).toContain(
        'AS "appealCase->appealAssistant->institution" ON "appealCase->appealAssistant"."institution_id"',
      )
      expect(sql).toContain(
        'AS "verdictAppealCase->appealAssistant->institution" ON "verdictAppealCase->appealAssistant"."institution_id"',
      )
      expect(sql).not.toContain('"rulingOrderAppealCases->')
    },
  )
})

import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealEventType,
  CaseFileCategory,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  getStatementFileCategories,
  getStatementUploadHeaderLine,
  getStatementUploadParty,
  isPartyStatementFile,
} from './VerdictAppealStatementUpload.logic'

const theCase = {
  defendants: [{ id: 'd1', name: 'Gervimaður Jónsson' }],
  civilClaimants: [{ id: 'c1', name: 'Fyrsti Kröfuhafi' }],
  appealProsecutor: { id: 'p1', name: 'Sækjandi Sækjandason' },
  verdictAppealCase: {
    id: 'appeal',
    statementDeadlines: [],
    appealEventLogs: [
      {
        id: 'e1',
        eventType: AppealEventType.APPEAL_STATEMENT_SENT,
        civilClaimantId: 'c1',
      },
    ],
  },
} as unknown as WorkingCase

describe('getStatementUploadParty', () => {
  it('resolves the defendant the query names', () => {
    expect(getStatementUploadParty(theCase, { defendantId: 'd1' })?.name).toBe(
      'Gervimaður Jónsson',
    )
  })

  it('resolves the prosecution when the query names nobody', () => {
    expect(getStatementUploadParty(theCase, {})?.role).toBe('PROSECUTION')
  })

  // Next hands a repeated query key over as an array; the first one counts.
  it('takes the first of a repeated query value', () => {
    expect(
      getStatementUploadParty(theCase, { defendantId: ['d1', 'd2'] })?.name,
    ).toBe('Gervimaður Jónsson')
  })

  it('resolves nobody for a party the case has not got', () => {
    expect(
      getStatementUploadParty(theCase, { defendantId: 'd2' }),
    ).toBeUndefined()
  })

  it('resolves nobody for a party whose statement is in', () => {
    expect(
      getStatementUploadParty(theCase, { civilClaimantId: 'c1' }),
    ).toBeUndefined()
  })
})

describe('getStatementFileCategories', () => {
  it('files the prosecution under its own categories', () => {
    expect(getStatementFileCategories({ role: 'PROSECUTION' })).toEqual({
      statement: CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT,
      caseFile: CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT_CASE_FILE,
    })
  })

  it.each(['DEFENDANT', 'CIVIL_CLAIMANT'] as const)(
    'files a %s under the defendant categories',
    (role) => {
      expect(getStatementFileCategories({ role })).toEqual({
        statement: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
        caseFile: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE,
      })
    },
  )
})

describe('isPartyStatementFile', () => {
  const category = CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT
  const defendant = { party: { defendantId: 'd1' } }

  it('matches a file of the category under the party', () => {
    expect(
      isPartyStatementFile(
        { category, defendantId: 'd1' },
        category,
        defendant,
      ),
    ).toBe(true)
  })

  it("rejects another party's file in the same category", () => {
    expect(
      isPartyStatementFile(
        { category, defendantId: 'd2' },
        category,
        defendant,
      ),
    ).toBe(false)
    expect(
      isPartyStatementFile(
        { category, civilClaimantId: 'c1' },
        category,
        defendant,
      ),
    ).toBe(false)
  })

  it("rejects the party's file in another category", () => {
    expect(
      isPartyStatementFile(
        {
          category:
            CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT_CASE_FILE,
          defendantId: 'd1',
        },
        category,
        defendant,
      ),
    ).toBe(false)
  })

  it('matches the prosecution by a file that names no party', () => {
    const prosecutorCategory =
      CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT

    expect(
      isPartyStatementFile(
        { category: prosecutorCategory },
        prosecutorCategory,
        { party: {} },
      ),
    ).toBe(true)
  })
})

describe('getStatementUploadHeaderLine', () => {
  it('names the party after its role', () => {
    expect(
      getStatementUploadHeaderLine({
        roleLabel: 'Ákærði',
        name: 'Gervimaður Jónsson',
      }),
    ).toBe('Ákærði Gervimaður Jónsson')
  })

  it('gives the role alone when there is no name', () => {
    expect(
      getStatementUploadHeaderLine({ roleLabel: 'Ákæruvaldið', name: '' }),
    ).toBe('Ákæruvaldið')
  })
})

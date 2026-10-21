import { v4 as uuid } from 'uuid'

import {
  CaseState,
  CaseType,
  InstitutionType,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../../repository'
import { canReplaceIndictmentPdf } from '../indictmentPdfReplacement'

describe('indictmentPdfReplacement', () => {
  const caseId = uuid()
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.SUBMITTED,
    indictmentHash: JSON.stringify({ hash: 'frozen', hashAlgorithm: 'SHA256' }),
  } as Case
  const prosecutor = {
    role: UserRole.PROSECUTOR,
    institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
  } as User

  it('allows a prosecutor on a submitted indictment with a frozen pdf', () => {
    expect(canReplaceIndictmentPdf(theCase, prosecutor)).toBe(true)
  })

  it('allows a received indictment with a frozen pdf', () => {
    expect(
      canReplaceIndictmentPdf(
        { ...theCase, state: CaseState.RECEIVED } as Case,
        prosecutor,
      ),
    ).toBe(true)
  })

  it('refuses a case whose indictment has not been frozen to S3', () => {
    expect(
      canReplaceIndictmentPdf(
        { ...theCase, indictmentHash: undefined } as Case,
        prosecutor,
      ),
    ).toBe(false)
  })

  it.each([
    ['a request case', { type: CaseType.CUSTODY }],
    ['a draft', { state: CaseState.DRAFT }],
    ['a completed case', { state: CaseState.COMPLETED }],
    ['a split case', { splitCaseId: uuid() }],
  ])('refuses %s', (_, override) => {
    expect(
      canReplaceIndictmentPdf(
        { ...theCase, ...override } as Case,
        prosecutor,
      ),
    ).toBe(false)
  })

  it('refuses a court user', () => {
    const judge = {
      role: UserRole.DISTRICT_COURT_JUDGE,
      institution: { type: InstitutionType.DISTRICT_COURT },
    } as User

    expect(canReplaceIndictmentPdf(theCase, judge)).toBe(false)
  })
})

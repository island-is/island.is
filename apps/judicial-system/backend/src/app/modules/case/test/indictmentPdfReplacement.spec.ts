import { v4 as uuid } from 'uuid'

import {
  CaseState,
  CaseType,
  InstitutionType,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../../repository'
import {
  canReplaceIndictmentPdf,
  isIndictmentPdfReplacementCase,
} from '../indictmentPdfReplacement'

describe('indictmentPdfReplacement', () => {
  const caseId = uuid()
  const allowed = [caseId]
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.SUBMITTED,
  } as Case
  const prosecutor = {
    role: UserRole.PROSECUTOR,
    institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
  } as User

  it('refuses every case by default', () => {
    expect(isIndictmentPdfReplacementCase(caseId)).toBe(false)
    expect(canReplaceIndictmentPdf(theCase, prosecutor)).toBe(false)
  })

  it('allows a prosecutor on an allowed submitted indictment', () => {
    expect(canReplaceIndictmentPdf(theCase, prosecutor, allowed)).toBe(true)
  })

  it('allows a received indictment', () => {
    expect(
      canReplaceIndictmentPdf(
        { ...theCase, state: CaseState.RECEIVED } as Case,
        prosecutor,
        allowed,
      ),
    ).toBe(true)
  })

  it.each([
    ['a case that is not allowed', { id: uuid() }],
    ['a request case', { type: CaseType.CUSTODY }],
    ['a draft', { state: CaseState.DRAFT }],
    ['a completed case', { state: CaseState.COMPLETED }],
    ['a split case', { splitCaseId: uuid() }],
  ])('refuses %s', (_, override) => {
    expect(
      canReplaceIndictmentPdf(
        { ...theCase, ...override } as Case,
        prosecutor,
        allowed,
      ),
    ).toBe(false)
  })

  it('refuses a court user', () => {
    const judge = {
      role: UserRole.DISTRICT_COURT_JUDGE,
      institution: { type: InstitutionType.DISTRICT_COURT },
    } as User

    expect(canReplaceIndictmentPdf(theCase, judge, allowed)).toBe(false)
  })
})

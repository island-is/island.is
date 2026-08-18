import {
  CourtDocumentResponse,
  CourtSessionResponse,
  CourtSessionString,
  CourtSessionStringType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { areMergedCaseEntriesComplete } from './validate'

describe('areMergedCaseEntriesComplete', () => {
  const document = (caseId: string) => ({ caseId } as CourtDocumentResponse)

  const entries = (mergedCaseId: string, value: string) =>
    ({
      mergedCaseId,
      value,
      stringType: CourtSessionStringType.ENTRIES,
    } as CourtSessionString)

  const session = (
    mergedFiledDocuments?: CourtDocumentResponse[],
    courtSessionStrings?: CourtSessionString[],
  ) => ({ mergedFiledDocuments, courtSessionStrings } as CourtSessionResponse)

  it('should be complete when the session has no merged documents', () => {
    expect(areMergedCaseEntriesComplete(session())).toBe(true)
    expect(areMergedCaseEntriesComplete(session([]))).toBe(true)
  })

  it('should be incomplete when a merged case has no entries at all', () => {
    expect(areMergedCaseEntriesComplete(session([document('case-1')]))).toBe(
      false,
    )
  })

  it('should be incomplete when a merged case has empty entries', () => {
    expect(
      areMergedCaseEntriesComplete(
        session([document('case-1')], [entries('case-1', '')]),
      ),
    ).toBe(false)
  })

  it('should be complete when every merged case has entries', () => {
    expect(
      areMergedCaseEntriesComplete(
        session(
          [document('case-1'), document('case-2')],
          [entries('case-1', 'Sameinað'), entries('case-2', 'Sameinað')],
        ),
      ),
    ).toBe(true)
  })

  it('should be incomplete when only one of two merged cases has entries', () => {
    expect(
      areMergedCaseEntriesComplete(
        session(
          [document('case-1'), document('case-2')],
          [entries('case-1', 'Sameinað')],
        ),
      ),
    ).toBe(false)
  })

  it('should count a merged case once however many documents it has', () => {
    expect(
      areMergedCaseEntriesComplete(
        session(
          [document('case-1'), document('case-1'), document('case-1')],
          [entries('case-1', 'Sameinað')],
        ),
      ),
    ).toBe(true)
  })

  it('should ignore entries belonging to another merged case', () => {
    expect(
      areMergedCaseEntriesComplete(
        session([document('case-1')], [entries('case-2', 'Sameinað')]),
      ),
    ).toBe(false)
  })
})

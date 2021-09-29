import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'

export const makeCase = (): Case => {
  return {
    id: 'test_id',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:51:39.466Z',
    state: CaseState.DRAFT,
    type: CaseType.CUSTODY,
    policeCaseNumber: '007-2021-202000',
    accusedNationalId: '000000-0000',
  }
}

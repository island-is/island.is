import { v4 as uuid } from 'uuid'

import {
  CaseFileCategory,
  CaseState,
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case, CaseFile, Defendant } from '../../../repository'
import { LimitedAccessCaseService } from '../../limitedAccessCase.service'

const defenderNationalId = '0101010101'

const makeDefendant = (overrides: Partial<Defendant> = {}): Defendant =>
  ({
    id: uuid(),
    name: 'Defendant',
    isDefenderChoiceConfirmed: true,
    caseFilesSharedWithDefender: true,
    defenderNationalId,
    eventLogs: [],
    subpoenas: [],
    policeCaseNumbers: ['007-2026-1'],
    ...overrides,
  } as Defendant)

const makeFile = (overrides: Partial<CaseFile> = {}): CaseFile =>
  ({
    id: uuid(),
    name: 'file.pdf',
    category: CaseFileCategory.CASE_FILE,
    created: new Date('2024-01-01'),
    ...overrides,
  } as CaseFile)

const makeIndictmentCase = (overrides: Partial<Case> = {}): Case =>
  ({
    id: uuid(),
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    defendants: [makeDefendant()],
    civilClaimants: [],
    caseFiles: [],
    courtSessions: [],
    ...overrides,
  } as Case)

describe('LimitedAccessCaseService - getDefenceUserAccessibleCaseFiles', () => {
  let limitedAccessCaseService: LimitedAccessCaseService

  const user = {
    nationalId: defenderNationalId,
    role: UserRole.DEFENDER,
  } as User

  const getAccessible = (theCase: Case, defenceUser: User = user) =>
    (
      limitedAccessCaseService as unknown as {
        getDefenceUserAccessibleCaseFiles: (
          theCase: Case,
          user: User,
        ) => { file: CaseFile; owningCase: Case }[]
      }
    ).getDefenceUserAccessibleCaseFiles(theCase, defenceUser)

  beforeEach(async () => {
    const { limitedAccessCaseService: service } = await createTestingCaseModule()

    limitedAccessCaseService = service
  })

  it('should return visible files on the case with the case as owner', () => {
    const visible = makeFile({ category: CaseFileCategory.PROSECUTOR_CASE_FILE })
    const theCase = makeIndictmentCase({ caseFiles: [visible] })

    expect(getAccessible(theCase)).toEqual([
      { file: visible, owningCase: theCase },
    ])
  })

  it('should judge merged case files against the parent and keep the merged case as owner', () => {
    const mergedFile = makeFile({ category: CaseFileCategory.CASE_FILE })
    const mergedCase = {
      id: uuid(),
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      // Shape mirrors the limited-access merged include: no appeal fields.
      defendants: [
        {
          id: uuid(),
          defenderNationalId: '9999999999',
          isDefenderChoiceConfirmed: true,
        } as Defendant,
      ],
      civilClaimants: [],
      caseFiles: [mergedFile],
    } as Case
    const theCase = makeIndictmentCase({
      defendants: [
        makeDefendant({
          appealDefenderNationalId: defenderNationalId,
          isAppealDefenderConfirmed: true,
        }),
      ],
      mergedCases: [mergedCase],
    })

    expect(getAccessible(theCase)).toEqual([
      { file: mergedFile, owningCase: mergedCase },
    ])
  })

  it('should judge split case files against the split case', () => {
    const splitFile = makeFile({ category: CaseFileCategory.COURT_CASE_FILE })
    const splitCase = makeIndictmentCase({
      caseFiles: [splitFile],
      defendants: [makeDefendant()],
    })
    const theCase = makeIndictmentCase({
      caseFiles: [],
      splitCases: [splitCase],
    })

    expect(getAccessible(theCase)).toEqual([
      { file: splitFile, owningCase: splitCase },
    ])
  })

  it('should omit another defendant\'s criminal record', () => {
    const myDefendant = makeDefendant({ id: 'defendant-mine' })
    const otherDefendant = makeDefendant({
      id: 'defendant-other',
      defenderNationalId: '0202020202',
    })
    const myCriminalRecord = makeFile({
      category: CaseFileCategory.CRIMINAL_RECORD,
      defendantId: myDefendant.id,
    })
    const otherCriminalRecord = makeFile({
      category: CaseFileCategory.CRIMINAL_RECORD,
      defendantId: otherDefendant.id,
    })
    const theCase = makeIndictmentCase({
      defendants: [myDefendant, otherDefendant],
      caseFiles: [myCriminalRecord, otherCriminalRecord],
    })

    expect(getAccessible(theCase)).toEqual([
      { file: myCriminalRecord, owningCase: theCase },
    ])
  })
})

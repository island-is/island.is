import {
  CaseAppealState,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system/types'
import { GetCurrentUserDocument } from '@island.is/judicial-system-web/src/components/UserProvider/getCurrentUser.generated'
import {
  CaseOrigin,
  CaseType,
  Gender,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { TransitionCaseDocument } from './hooks/useCase/transitionCase.generated'

export const mockCourt = {
  id: 'court_id',
  type: InstitutionType.DISTRICT_COURT,
  name: 'Héraðsdómur Reykjavíkur',
}

export const mockCourtOfAppeals = {
  id: 'court_of_appeals_id',
  type: InstitutionType.COURT_OF_APPEALS,
  name: 'Landsréttur',
}

export const mockPrison = {
  id: 'prison_id',
  type: InstitutionType.PRISON,
  name: 'Stóra Hraun',
}

export const mockProsecutor = {
  role: UserRole.PROSECUTOR,
  name: 'Batman Robinson',
  title: 'saksóknari',
  institution: {
    id: '1337',
    type: InstitutionType.PROSECUTORS_OFFICE,
    name: 'Lögreglustjórinn á höfuðborgarsvæðinu',
  },
} as User

export const mockJudge = {
  id: 'judge_1',
  role: UserRole.DISTRICT_COURT_JUDGE,
  name: 'Wonder Woman',
  title: 'héraðsdómari',
  institution: mockCourt,
} as User

export const mockCourtOfAppealsUser = {
  id: 'hc_1',
  role: UserRole.COURT_OF_APPEALS_JUDGE,
  name: 'Lalli Landsréttardómari',
  title: 'dómari',
  institution: mockCourtOfAppeals,
} as User

export const mockPrisonUser = {
  id: 'hc_1',
  role: UserRole.PRISON_SYSTEM_STAFF,
  name: 'Finnur fangavörður',
  title: 'fangavörður',
  institution: mockPrison,
} as User

export const mockJudgeQuery = [
  {
    request: {
      query: GetCurrentUserDocument,
    },
    result: {
      data: {
        currentUser: mockJudge,
      },
    },
  },
]

export const mockCourtOfAppealsQuery = [
  {
    request: {
      query: GetCurrentUserDocument,
    },
    result: {
      data: {
        currentUser: mockCourtOfAppealsUser,
      },
    },
  },
]

export const mockPrisonUserQuery = [
  {
    request: {
      query: GetCurrentUserDocument,
    },
    result: {
      data: {
        currentUser: mockPrisonUser,
      },
    },
  },
]

export const mockProsecutorQuery = [
  {
    request: {
      query: GetCurrentUserDocument,
    },
    result: {
      data: {
        currentUser: mockProsecutor,
      },
    },
  },
]

export const mockTransitonCaseMutation = (caseId: string) => [
  {
    request: {
      query: TransitionCaseDocument,
      variables: {
        input: {
          id: caseId,
          transition: CaseTransition.COMPLETE_APPEAL,
        },
      },
    },
    result: {
      data: {
        transitionCase: {
          state: CaseState.ACCEPTED,
          appealState: CaseAppealState.COMPLETED,
          statementDeadline: '2021-09-09T12:00:00.000Z',
          appealReceivedByCourtDate: '2021-09-09T12:00:00.000Z',
        },
      },
    },
  },
]

export const mockCase = (caseType: CaseType): Case => {
  return {
    id: 'test_id',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:51:39.466Z',
    state: CaseState.DRAFT,
    origin: CaseOrigin.RVG,
    type: caseType,
    policeCaseNumbers: ['007-2021-202000'],
    defendants: [
      {
        id: 'test_defendant_id',
        created: '2020-09-16T19:50:08.033Z',
        modified: '2020-09-16T19:51:39.466Z',
        caseId: 'test_id',
        nationalId: '000000-0000',
        name: 'Donald Duck',
        gender: Gender.MALE,
        address: 'Batcave 1337',
        defendantWaivesRightToCounsel: false,
      },
    ],
    defendantWaivesRightToCounsel: false,
  }
}

import { Gender, CaseState } from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  InstitutionType,
  User,
  UserRole,
  CaseType,
  CaseOrigin,
  CurrentUserDocument,
} from '@island.is/judicial-system-web/src/graphql/schema'

export const mockCourt = {
  id: 'court_id',
  type: InstitutionType.COURT,
  name: 'Héraðsdómur Reykjavíkur',
}

export const mockHighCourt = {
  id: 'high_court_id',
  type: InstitutionType.HIGH_COURT,
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
    name: 'Lögreglustjórinn á höfuðborgarsvæðinu',
  },
} as User

export const mockJudge = {
  id: 'judge_1',
  role: UserRole.JUDGE,
  name: 'Wonder Woman',
  title: 'héraðsdómari',
  institution: mockCourt,
} as User

export const mockHighCourtUser = {
  id: 'hc_1',
  role: UserRole.JUDGE,
  name: 'Lalli Landsréttardómari',
  title: 'dómari',
  institution: mockHighCourt,
} as User

export const mockPrisonUser = {
  id: 'hc_1',
  role: UserRole.STAFF,
  name: 'Finnur fangavörður',
  title: 'fangavörður',
  institution: mockPrison,
} as User

export const mockJudgeQuery = [
  {
    request: {
      query: CurrentUserDocument,
    },
    result: {
      data: {
        currentUser: mockJudge,
      },
    },
  },
]

export const mockHighCourtQuery = [
  {
    request: {
      query: CurrentUserDocument,
    },
    result: {
      data: {
        currentUser: mockHighCourtUser,
      },
    },
  },
]

export const mockPrisonUserQuery = [
  {
    request: {
      query: CurrentUserDocument,
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
      query: CurrentUserDocument,
    },
    result: {
      data: {
        currentUser: mockProsecutor,
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

import faker from 'faker'

import { CurrentUserDocument } from '@island.is/judicial-system-web/src/components/UserProvider/currentUser.generated'
import {
  Case,
  CaseAppealState,
  CaseFile,
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  CaseState,
  CaseTransition,
  CaseType,
  Gender,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

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
    type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
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
      query: CurrentUserDocument,
    },
    result: {
      data: {
        currentUser: { user: mockJudge },
      },
    },
  },
]

export const mockCourtOfAppealsJudgeQuery = [
  {
    request: {
      query: CurrentUserDocument,
    },
    result: {
      data: {
        currentUser: { user: mockCourtOfAppealsUser },
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
        currentUser: { user: mockPrisonUser },
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
        currentUser: { user: mockProsecutor },
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
        defenderChoice: null,
      },
    ],
    defendantWaivesRightToCounsel: false,
  }
}

export const mockUser = (userRole: UserRole): User => {
  return {
    active: true,
    canConfirmIndictment: false,
    created: '',
    email: '',
    id: '',
    mobileNumber: '',
    modified: '',
    name: '',
    nationalId: '',
    title: '',
    role: userRole,
    institution: {
      id: '',
      created: '',
      modified: '',
      type:
        // TODO: Add more institutions if we use more user roles
        userRole === UserRole.PROSECUTOR
          ? InstitutionType.POLICE_PROSECUTORS_OFFICE
          : InstitutionType.DISTRICT_COURT,
      name: '',
      active: true,
    },
  }
}

export const mockCaseFile = (category?: CaseFileCategory): CaseFile => {
  return {
    caseId: faker.datatype.uuid(),
    category: category ?? CaseFileCategory.CASE_FILE,
    chapter: null,
    created: faker.date.past().toISOString(),
    displayDate: faker.date.past().toISOString(),
    id: faker.datatype.uuid(),
    key: faker.lorem.paragraph(3).replace(' ', ''),
    modified: faker.date.past().toISOString(),
    name: faker.random.word(),
    orderWithinChapter: null,
    policeCaseNumber: '123123213',
    policeFileId: '123123123',
    size: 123,
    state: CaseFileState.STORED_IN_RVG,
    type: '??',
    userGeneratedFilename: '',
    isKeyAccessible: true,
  }
}

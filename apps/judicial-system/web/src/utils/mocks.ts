import {
  CaseCustodyProvisions,
  UpdateCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import { CaseQuery, UpdateCaseMutation } from '../graphql'

export const mockProsecutor = {
  role: UserRole.PROSECUTOR,
  name: 'Batman Robinson',
  title: 'saksóknari',
} as User

export const mockJudge = {
  role: UserRole.JUDGE,
  name: 'Wonder Woman',
  title: 'héraðsdómari',
} as User

export const mockJudgeUserContext = {
  isAuthenticated: () => true,
  user: mockJudge,
  setUser: (_: User) => undefined,
}

export const mockProsecutorUserContext = {
  isAuthenticated: () => true,
  user: mockProsecutor,
  setUser: (_: User) => undefined,
}

const testCase1 = {
  id: 'test_id',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  state: 'DRAFT',
  policeCaseNumber: 'string',
  accusedNationalId: 'string',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  court: 'string',
  arrestDate: '2020-09-16T19:51:28.224Z',
  requestedCourtDate: '2020-09-16T19:51:28.224Z',
  requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
  lawsBroken: 'string',
  custodyProvisions: [
    CaseCustodyProvisions._95_1_A,
    CaseCustodyProvisions._95_1_C,
  ],
  requestedCustodyRestrictions: ['ISOLATION', 'MEDIA'],
  caseFacts: 'string',
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: 'string',
  comments: 'string',
  prosecutor: null,
  courtCaseNumber: null,
  courtStartTime: null,
  courtEndTime: null,
  courtAttendees: null,
  policeDemands: null,
  accusedPlea: null,
  litigationPresentations: null,
  ruling: null,
  rejecting: null,
  custodyEndDate: null,
  custodyRestrictions: null,
  accusedAppealDecision: null,
  accusedAppealAnnouncement: null,
  prosecutorAppealDecision: null,
  prosecutorAppealAnnouncement: null,
  judge: null,
  notifications: null,
}

const testCase2 = {
  id: 'test_id_2',
  created: '2020-09-16T19:50:08.033Z',
  modified: '2020-09-16T19:51:39.466Z',
  state: 'DRAFT',
  policeCaseNumber: 'string',
  accusedNationalId: 'string',
  accusedName: 'Jon Harring',
  accusedAddress: 'Harringvej 2',
  court: 'string',
  arrestDate: '2020-09-16T19:51:28.224Z',
  requestedCourtDate: '2020-09-16T19:51:28.224Z',
  requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
  lawsBroken: 'string',
  custodyProvisions: [],
  requestedCustodyRestrictions: [],
  caseFacts: 'string',
  witnessAccounts: 'string',
  investigationProgress: 'string',
  legalArguments: 'string',
  comments: 'string',
  prosecutor: null,
  courtCaseNumber: null,
  courtStartTime: null,
  courtEndTime: null,
  courtAttendees: null,
  policeDemands: null,
  accusedPlea: null,
  litigationPresentations: null,
  ruling: null,
  rejecting: null,
  custodyEndDate: null,
  custodyRestrictions: null,
  accusedAppealDecision: null,
  accusedAppealAnnouncement: null,
  prosecutorAppealDecision: null,
  prosecutorAppealAnnouncement: null,
  judge: null,
  notifications: null,
}

export const mockCaseQueries = [
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id' } },
    },
    result: {
      data: {
        case: testCase1,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: 'test_id_2' } },
    },
    result: {
      data: {
        case: testCase2,
      },
    },
  },
  {
    request: {
      query: CaseQuery,
      variables: { input: { id: undefined } },
    },
    result: {
      error: {},
    },
  },
]

export const mockUpdateCaseMutation = (updateCases: UpdateCase[]) =>
  updateCases.map((updateCase) => {
    return {
      request: {
        query: UpdateCaseMutation,
        variables: { input: { id: 'test_id_2', ...updateCase } },
      },
      result: {
        data: {
          case: testCase2,
        },
      },
    }
  })

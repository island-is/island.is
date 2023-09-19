import { CyHttpMessages } from 'cypress/types/net-stubbing'
import faker from 'faker'

import {
  Case,
  Gender,
  CaseState,
  CaseType,
  Institution,
  InstitutionType,
  User,
  UserRole,
  CaseOrigin,
  CaseFile,
  CaseFileState,
  CaseFileCategory,
  IndictmentSubtype,
} from '@island.is/judicial-system/types'

export enum Operation {
  CaseQuery = 'Case',
  CaseListQuery = 'CaseList',
  CurrentUserQuery = 'CurrentUser',
  UploadFileToCourtMutation = 'UploadFileToCourt',
  UpdateCaseMutation = 'UpdateCase',
  SendNotificationMutation = 'SendNotification',
  CreatePresignedPostMutation = 'CreatePresignedPost',
  CreateFileMutation = 'CreateFile',
  UpdateDefendantMutation = 'UpdateDefendant',
  LimitedAccessCaseQuery = 'LimitedAccessCase',
  ProsecutorSelectionUsersQuery = 'ProsecutorSelectionUsers',
  TransitionCaseMutation = 'TransitionCase',
}

export const intercept = (res: Case, forceFail?: Operation) => {
  cy.intercept('POST', '**/api/graphql', (req) => {
    if (hasOperationName(req, Operation.CaseQuery)) {
      req.alias = 'gqlCaseQuery'
      req.reply({
        data: {
          case: res,
        },
      })
    } else if (hasOperationName(req, Operation.LimitedAccessCaseQuery)) {
      req.alias = 'gqlCaseQuery'
      req.reply({
        data: {
          limitedAccessCase: res,
        },
      })
    } else if (hasOperationName(req, Operation.UploadFileToCourtMutation)) {
      req.alias = 'UploadFileToCourtMutation'
      req.reply({
        data: {
          uploadFileToCourt: {
            success: true,
            __typename: 'UploadFileToCourtResponse',
          },
        },
      })
    } else if (hasOperationName(req, Operation.UpdateCaseMutation)) {
      const { body } = req
      req.alias = 'UpdateCaseMutation'
      req.reply({
        data: {
          updateCase: { ...body.variables?.input, __typename: 'Case' },
        },
      })
    } else if (hasOperationName(req, Operation.SendNotificationMutation)) {
      req.alias = 'SendNotificationMutation'
      req.reply({
        fixture:
          forceFail === Operation.SendNotificationMutation
            ? 'sendNotificationFailedMutationResponse'
            : 'sendNotificationMutationResponse',
      })
    } else if (hasOperationName(req, Operation.CreatePresignedPostMutation)) {
      req.alias = 'CreatePresignedPostMutation'
      req.reply({
        fixture: 'createPresignedPostMutationResponse',
      })
    } else if (hasOperationName(req, Operation.CreateFileMutation)) {
      req.alias = 'CreateFileMutation'
      req.reply({
        fixture: 'createFileMutationResponse',
      })
    } else if (hasOperationName(req, Operation.UpdateDefendantMutation)) {
      req.alias = 'UpdateDefendantMutation'
      req.reply({
        fixture: 'updateDefendantMutationResponse',
      })
    } else if (hasOperationName(req, Operation.ProsecutorSelectionUsersQuery)) {
      req.alias = 'gqlProsecutorSelectionUsersQuery'
      req.reply({
        fixture: 'prosecutorUsers',
      })
    } else if (hasOperationName(req, Operation.TransitionCaseMutation)) {
      req.alias = 'TransitionCaseMutation'
      req.reply({
        fixture: 'transitionCaseMutationResponse',
      })
    } else if (hasOperationName(req, Operation.CaseListQuery)) {
      req.reply({
        fixture: 'cases',
      })
    }
  })
}

export const hasOperationName = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  const { body } = req
  return (
    body.hasOwnProperty('operationName') && body.operationName === operationName
  )
}

// Alias query if operationName matches
export const aliasQuery = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`
  }
}

// Alias mutation if operationName matches
export const aliasMutation = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`
  }
}

export const mockName = `${faker.name.firstName()} ${faker.name.lastName()}`
export const mockAddress = faker.address.streetAddress()

export const mockCase = (
  type: CaseType,
  indictmentSubtype?: IndictmentSubtype,
): Case => {
  const caseId = faker.datatype.uuid()

  const policeCaseNumber = '007-2021-202000'
  return {
    id: caseId,
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    state: CaseState.DRAFT,
    origin: CaseOrigin.RVG,
    type,
    indictmentSubtypes: indictmentSubtype
      ? { [policeCaseNumber]: [indictmentSubtype] }
      : undefined,
    court: makeCourt(),
    policeCaseNumbers: [policeCaseNumber],
    defendants: [makeDefendant(caseId)],
    defendantWaivesRightToCounsel: false,
  }
}

export const makeJudge = (): User => {
  return {
    id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    name: faker.name.firstName(),
    // eslint-disable-next-line local-rules/disallow-kennitalas
    nationalId: '111111-1111',
    mobileNumber: '111-1111',
    email: faker.internet.email(),
    role: UserRole.JUDGE,
    active: true,
    title: 'Dómari',
    institution: {
      id: '53581d7b-0591-45e5-9cbe-c96b2f82da85',
      created: '',
      modified: '',
      type: InstitutionType.DISTRICT_COURT,
      name: 'Dómstóll Testlands',
      active: true,
    },
  }
}

export const makeProsecutor = (name?: string): User => {
  return {
    id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    name: name ?? 'Áki Ákærandi',
    nationalId: '000000-0000',
    mobileNumber: '000-0000',
    email: 'prosecutor@law.is',
    role: UserRole.PROSECUTOR,
    active: true,
    title: 'aðstoðarsaksóknari',
    institution: {
      id: '53581d7b-0591-45e5-9cbe-c96b2f82da85',
      created: '',
      modified: '',
      type: InstitutionType.PROSECUTORS_OFFICE,
      name: 'Lögreglan á Höfuðborgarsvæðinu',
      active: true,
    },
  }
}

export const makeDefendant = (caseId: string) => {
  return {
    id: faker.datatype.uuid(),
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:51:39.466Z',
    caseId,
    nationalId: '000000-0000',
    name: mockName,
    gender: Gender.MALE,
    address: mockAddress,
    defendantWaivesRightToCounsel: false,
  }
}

export const makeCourt = (): Institution => {
  return {
    id: 'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    type: InstitutionType.DISTRICT_COURT,
    name: 'Héraðsdómur Reykjavíkur',
    active: true,
  }
}

export const makeCaseFile = ({
  caseId = 'test_id',
  name = 'test_file_name',
  type = 'pdf',
  state = CaseFileState.STORED_IN_RVG,
  key = 'test_id',
  size = 100,
  category = CaseFileCategory.CASE_FILE,
  policeCaseNumber = undefined as string | undefined,
  chapter = undefined as number | undefined,
  orderWithinChapter = undefined as number | undefined,
} = {}): CaseFile => {
  return {
    id: faker.datatype.uuid(),
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    caseId,
    type,
    name,
    state,
    key,
    size,
    category,
    policeCaseNumber,
    chapter,
    orderWithinChapter,
  }
}

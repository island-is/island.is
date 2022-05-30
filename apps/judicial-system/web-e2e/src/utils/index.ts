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
} from '@island.is/judicial-system/types'

export enum Operation {
  CaseQuery = 'CaseQuery',
  RestrictedCaseQuery = 'RestrictedCaseQuery',
  UploadFileToCourtMutation = 'UploadFileToCourtMutation',
  UpdateCaseMutation = 'UpdateCaseMutation',
  SendNotificationMutation = 'SendNotificationMutation',
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
    } else if (hasOperationName(req, Operation.RestrictedCaseQuery)) {
      req.alias = 'gqlCaseQuery'
      req.reply({
        data: {
          restrictedCase: res,
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

export const investigationCaseAccusedName = `${faker.name.firstName()} ${faker.name.lastName()}`
export const investigationCaseAccusedAddress = faker.address.streetAddress()

export const makeRestrictionCase = (): Case => {
  return {
    id: 'test_id',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:51:39.466Z',
    state: CaseState.DRAFT,
    origin: CaseOrigin.RVG,
    type: CaseType.CUSTODY,
    policeCaseNumber: '007-2021-202000',
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
      },
    ],
  }
}

export const makeInvestigationCase = (): Case => {
  const caseId = faker.datatype.uuid()
  return {
    id: caseId,
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    state: CaseState.DRAFT,
    origin: CaseOrigin.RVG,
    type: CaseType.INTERNET_USAGE,
    court: {
      id: 'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf',
      created: '2020-09-16T19:50:08.033Z',
      modified: '2020-09-16T19:50:08.033Z',
      type: InstitutionType.COURT,
      name: 'Héraðsdómur Reykjavíkur',
      active: true,
    },
    policeCaseNumber: '007-2021-202000',
    defendants: [
      {
        id: 'test_defendant_id',
        created: '2020-09-16T19:50:08.033Z',
        modified: '2020-09-16T19:51:39.466Z',
        caseId,
        nationalId: '000000-0000',
        name: investigationCaseAccusedName,
        gender: Gender.MALE,
        address: investigationCaseAccusedAddress,
      },
    ],
  }
}

export const makeProsecutor = (): User => {
  return {
    id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    name: 'Áki Ákærandi',
    nationalId: '000000-0000',
    mobileNumber: '000-0000',
    email: 'prosecutor@law.is',
    role: UserRole.PROSECUTOR,
    active: true,
    title: 'aðstoðarsaksóknari',
    institution: {
      id: '',
      created: '',
      modified: '',
      type: InstitutionType.PROSECUTORS_OFFICE,
      name: 'Lögreglan á Höfuðborgarsvæðinu',
      active: true,
    },
  }
}

export const makeCourt = (): Institution => {
  return {
    id: 'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    type: InstitutionType.COURT,
    name: 'Héraðsdómur Reykjavíkur',
    active: true,
  }
}

export const makeCaseFile = (
  caseId = 'test_id',
  name = 'test_file_name',
  type = 'pdf',
  state = CaseFileState.STORED_IN_RVG,
  key = 'test_id',
  size = 100,
): CaseFile => {
  return {
    id: 'test_case_file_id',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    caseId,
    type,
    name,
    state,
    key,
    size,
  }
}

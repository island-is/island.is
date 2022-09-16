import { CyHttpMessages } from 'cypress/types/net-stubbing'
import faker from 'faker'
import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import {
  CreateCaseMutation,
  TransitionCaseInput,
  UpdateCaseInput,
} from '../graphql/schema'

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
  CaseTransition,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { INDICTMENTS_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'

const cache = new InMemoryCache()
const client = new ApolloClient({
  cache,
  uri: 'http://localhost:3333/api/graphql',
  name: 'judicial-system-web-e2e-client',
})

export enum Operation {
  CaseQuery = 'CaseQuery',
  UploadFileToCourtMutation = 'UploadFileToCourtMutation',
  UpdateCaseMutation = 'UpdateCaseMutation',
  SendNotificationMutation = 'SendNotificationMutation',
  CreatePresignedPostMutation = 'CreatePresignedPostMutation',
  CreateFileMutation = 'CreateFileMutation',
  LimitedAccessCaseQuery = 'LimitedAccessCaseQuery',
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

export const loginAndCreateCase = (
  type: CaseType,
  policeCaseNumbers: string[],
) => {
  return cy
    .visit('http://localhost:4200/api/auth/login?nationalId=0000000009')
    .then(() =>
      client.mutate<CreateCaseMutation>({
        mutation: gql`
          mutation CreateCase($input: CreateCaseInput!) {
            createCase(input: $input) {
              id
              defendants {
                id
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          input: {
            type,
            description: 'Test',
            policeCaseNumbers,
            defenderName: 'Test',
            defenderNationalId: '0000000000',
            defenderEmail: 'ivaro@kolibri.is',
            defenderPhoneNumber: '0000000',
            sendRequestToDefender: false,
            leadInvestigator: 'asd',
          },
        },
      }),
    )
    .then((res) => {
      return cy
        .wrap(res)
        .should('have.property', 'data')
        .then(() => {
          return res.data?.createCase?.id || ''
        })
    })
}

export const transitionCase = (caseId: string, transition: CaseTransition) => {
  client.mutate({
    mutation: gql`
      mutation TransitionCaseMutation($input: TransitionCaseInput!) {
        transitionCase(input: $input) {
          state
        }
      }
    `,
    variables: {
      input: {
        id: caseId,
        transition,
        modified: new Date().toISOString(),
      },
    },
    fetchPolicy: 'no-cache',
  })
}

export const mockName = `${faker.name.firstName()} ${faker.name.lastName()}`
export const mockAddress = faker.address.streetAddress()

export const mockCase = (type: CaseType) => {
  const caseId = faker.datatype.uuid()
  return {
    id: caseId,
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    state: CaseState.DRAFT,
    origin: CaseOrigin.RVG,
    type,
    court: makeCourt(),
    policeCaseNumbers: ['007-2021-202000'],
    defendants: [
      {
        id: faker.datatype.uuid(),
        created: '2020-09-16T19:50:08.033Z',
        modified: '2020-09-16T19:51:39.466Z',
        caseId,
        nationalId: '000000-0000',
        name: mockName,
        gender: Gender.MALE,
        address: mockAddress,
      },
    ],
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
      type: InstitutionType.COURT,
      name: 'Dómstóll Testlands',
      active: true,
    },
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
      id: '53581d7b-0591-45e5-9cbe-c96b2f82da85',
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

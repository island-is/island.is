import { uuid } from 'uuidv4'
import { Response } from 'express'
import each from 'jest-each'
import * as streamBuffers from 'stream-buffers'

import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { BadRequestException } from '@nestjs/common'

import { LoggingModule } from '@island.is/logging'
import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { SigningService } from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import { IntlService } from '@island.is/cms-translations'
import {
  CaseState,
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import * as formatters from '../../formatters'
import { CourtService } from '../court'
import { UserService } from '../user'
import { EventService } from '../event'
import { Case } from './models'
import { CaseService } from './case.service'
import { CaseController } from './case.controller'

describe('CaseController', () => {
  let caseModel: { findOne: jest.Mock }
  let caseController: CaseController

  beforeEach(async () => {
    caseModel = { findOne: jest.fn() }

    const caseModule = await Test.createTestingModule({
      imports: [
        LoggingModule,
        SharedAuthModule.register({
          jwtSecret: environment.auth.jwtSecret,
          secretToken: environment.auth.secretToken,
        }),
      ],
      controllers: [CaseController],
      providers: [
        {
          provide: CourtService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: EventService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: SigningService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: EmailService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: IntlService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: getModelToken(Case),
          useValue: caseModel,
        },
        CaseService,
      ],
    }).compile()

    caseController = caseModule.get<CaseController>(CaseController)
  })

  describe('when getting a custody notice pdf', () => {
    each`
      type
      ${CaseType.TRAVEL_BAN}
      ${CaseType.SEARCH_WARRANT}
      ${CaseType.BANKING_SECRECY_WAIVER}
      ${CaseType.PHONE_TAPPING}
      ${CaseType.TELECOMMUNICATIONS}
      ${CaseType.TRACKING_EQUIPMENT}
      ${CaseType.PSYCHIATRIC_EXAMINATION}
      ${CaseType.SOUND_RECORDING_EQUIPMENT}
      ${CaseType.AUTOPSY}
      ${CaseType.BODY_SEARCH}
      ${CaseType.INTERNET_USAGE}
      ${CaseType.OTHER}
      `.describe('given a $type case', ({ type }) => {
      each`
        role
        ${UserRole.PROSECUTOR}
        ${UserRole.JUDGE}
        ${UserRole.REGISTRAR}
      `.describe('given a $role user', ({ role }) => {
        // RolesGuard blocks access for the ADMIN role. Also, mockFindByIdAndUser
        // blocks access for some roles to some cases. This is not relevant in
        // this test.
        const user = { role } as User
        const id = uuid()
        const mockCase = { id, type }

        beforeEach(() => {
          caseModel.findOne.mockResolvedValueOnce(mockCase)
        })

        it('should throw', async () => {
          const response = {} as Response

          await expect(
            caseController.getCustodyNoticePdf(id, user, response),
          ).rejects.toThrow(BadRequestException)
        })
      })
    })

    describe('given a custody case', () => {
      const id = uuid()
      const mockCase = { id, type: CaseType.CUSTODY }
      each`
        state                  | role
        ${CaseState.NEW}       | ${UserRole.PROSECUTOR}
        ${CaseState.DRAFT}     | ${UserRole.PROSECUTOR}
        ${CaseState.DRAFT}     | ${UserRole.JUDGE}
        ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}
        ${CaseState.SUBMITTED} | ${UserRole.PROSECUTOR}
        ${CaseState.SUBMITTED} | ${UserRole.JUDGE}
        ${CaseState.SUBMITTED} | ${UserRole.REGISTRAR}
        ${CaseState.RECEIVED}  | ${UserRole.PROSECUTOR}
        ${CaseState.RECEIVED}  | ${UserRole.JUDGE}
        ${CaseState.RECEIVED}  | ${UserRole.REGISTRAR}
        ${CaseState.REJECTED}  | ${UserRole.PROSECUTOR}
        ${CaseState.REJECTED}  | ${UserRole.JUDGE}
        ${CaseState.REJECTED}  | ${UserRole.REGISTRAR}
        ${CaseState.DISMISSED} | ${UserRole.PROSECUTOR}
        ${CaseState.DISMISSED} | ${UserRole.JUDGE}
        ${CaseState.DISMISSED} | ${UserRole.REGISTRAR}
      `.it(
        'should throw if the case has not been accepted',
        async ({ state, role }) => {
          // RolesGuard blocks access for the ADMIN role. Also, mockFindByIdAndUser
          // blocks access for some roles to some cases. This is not relevant in
          // this test.
          const user = { role } as User

          caseModel.findOne.mockResolvedValueOnce({ ...mockCase, state })

          const response = {} as Response

          await expect(
            caseController.getCustodyNoticePdf(id, user, response),
          ).rejects.toThrow(BadRequestException)
        },
      )
      each`
        role
        ${UserRole.PROSECUTOR}
        ${UserRole.JUDGE}
        ${UserRole.REGISTRAR}
      `.it(
        'should get the custody notice pdf if the case has been accepted',
        async ({ role }) => {
          // RolesGuard blocks access for the ADMIN role. Also, mockFindByIdAndUser
          // blocks access for some roles to some cases. This is not relevant in
          // this test.
          const user = { role } as User

          const mockAcceptedCase = { ...mockCase, state: CaseState.ACCEPTED }
          caseModel.findOne.mockResolvedValueOnce(mockAcceptedCase)

          const mockPdf = 'Mock PDF content'
          const mockGetCustodyNoticePdfAsString = jest.spyOn(
            formatters,
            'getCustodyNoticePdfAsString',
          )
          mockGetCustodyNoticePdfAsString.mockResolvedValueOnce(mockPdf)

          const mockPut = jest.fn()
          const mockPipe = jest.fn()
          const mockReadableStreamBuffer = jest.spyOn(
            streamBuffers,
            'ReadableStreamBuffer',
          )
          mockReadableStreamBuffer.mockReturnValueOnce(({
            put: mockPut,
            pipe: mockPipe,
          } as unknown) as streamBuffers.ReadableStreamBuffer)
          const mockResponse = {} as Response
          mockPipe.mockReturnValueOnce(mockResponse)

          const response = ({ header: jest.fn() } as unknown) as Response

          const result = await caseController.getCustodyNoticePdf(
            id,
            user,
            response,
          )

          expect(mockGetCustodyNoticePdfAsString).toHaveBeenCalledWith(
            mockAcceptedCase,
          )

          expect(mockPut).toHaveBeenCalledWith(mockPdf, 'binary')

          expect(response.header).toHaveBeenCalledWith('Content-length', '16')

          expect(mockPipe).toHaveBeenCalledWith(response)

          expect(result).toBe(mockResponse)
        },
      )
    })
  })
})

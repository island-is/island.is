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
  InstitutionType,
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
      ${CaseType.RESTRAINING_ORDER}
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
        state                  | role                   | institutionType
        ${CaseState.NEW}       | ${UserRole.PROSECUTOR} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.DRAFT}     | ${UserRole.PROSECUTOR} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.DRAFT}     | ${UserRole.JUDGE}      | ${InstitutionType.COURT}
        ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}  | ${InstitutionType.COURT}
        ${CaseState.SUBMITTED} | ${UserRole.PROSECUTOR} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.SUBMITTED} | ${UserRole.JUDGE}      | ${InstitutionType.COURT}
        ${CaseState.SUBMITTED} | ${UserRole.REGISTRAR}  | ${InstitutionType.COURT}
        ${CaseState.RECEIVED}  | ${UserRole.PROSECUTOR} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.RECEIVED}  | ${UserRole.JUDGE}      | ${InstitutionType.COURT}
        ${CaseState.RECEIVED}  | ${UserRole.REGISTRAR}  | ${InstitutionType.COURT}
        ${CaseState.REJECTED}  | ${UserRole.PROSECUTOR} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.REJECTED}  | ${UserRole.JUDGE}      | ${InstitutionType.COURT}
        ${CaseState.REJECTED}  | ${UserRole.REGISTRAR}  | ${InstitutionType.COURT}
        ${CaseState.REJECTED}  | ${UserRole.JUDGE}      | ${InstitutionType.HIGH_COURT}
        ${CaseState.REJECTED}  | ${UserRole.REGISTRAR}  | ${InstitutionType.HIGH_COURT}
        ${CaseState.DISMISSED} | ${UserRole.PROSECUTOR} | ${InstitutionType.PROSECUTORS_OFFICE}
        ${CaseState.DISMISSED} | ${UserRole.JUDGE}      | ${InstitutionType.COURT}
        ${CaseState.DISMISSED} | ${UserRole.REGISTRAR}  | ${InstitutionType.COURT}
        ${CaseState.DISMISSED}  | ${UserRole.JUDGE}      | ${InstitutionType.HIGH_COURT}
        ${CaseState.DISMISSED}  | ${UserRole.REGISTRAR}  | ${InstitutionType.HIGH_COURT}
      `.it(
        'should throw if the case has not been accepted',
        async ({ state, role, institutionType }) => {
          // RolesGuard blocks access for the ADMIN role. Also, mockFindByIdAndUser
          // blocks access for some roles to some cases. This is not relevant in
          // this test.
          const user = { role, institution: { type: institutionType } } as User

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
        ${UserRole.STAFF}
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

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
import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import * as formatters from '../../formatters'
import { CourtService } from '../court'
import { UserService } from '../user'
import { EventService } from '../event'
import { FileService } from '../file'
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
          provide: FileService,
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
      const id = uuid()
      const mockCase = { id, type } as Case

      beforeEach(() => {
        caseModel.findOne.mockResolvedValueOnce(mockCase)
      })

      it('should throw', async () => {
        const response = {} as Response

        await expect(
          caseController.getCustodyNoticePdf(id, mockCase, response),
        ).rejects.toThrow(BadRequestException)
      })
    })

    describe('given a custody case', () => {
      const id = uuid()
      const mockCase = { id, type: CaseType.CUSTODY } as Case

      each`
        state
        ${CaseState.NEW}
        ${CaseState.DRAFT}
        ${CaseState.DRAFT}
        ${CaseState.DRAFT}
        ${CaseState.SUBMITTED}
        ${CaseState.SUBMITTED}
        ${CaseState.SUBMITTED}
        ${CaseState.RECEIVED}
        ${CaseState.RECEIVED}
        ${CaseState.RECEIVED}
        ${CaseState.REJECTED}
        ${CaseState.REJECTED}
        ${CaseState.REJECTED}
        ${CaseState.REJECTED}
        ${CaseState.REJECTED}
        ${CaseState.DISMISSED}
        ${CaseState.DISMISSED}
        ${CaseState.DISMISSED}
        ${CaseState.DISMISSED}
        ${CaseState.DISMISSED}
      `.it(
        'should throw if the case has not been accepted',
        async ({ state }) => {
          const response = {} as Response

          const mockNotAcceptedCase = { ...mockCase, state } as Case

          await expect(
            caseController.getCustodyNoticePdf(
              id,
              mockNotAcceptedCase,
              response,
            ),
          ).rejects.toThrow(BadRequestException)
        },
      )

      it('should get the custody notice pdf if the case has been accepted', async () => {
        const mockAcceptedCase = {
          ...mockCase,
          state: CaseState.ACCEPTED,
        } as Case

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
          mockAcceptedCase,
          response,
        )

        expect(mockGetCustodyNoticePdfAsString).toHaveBeenCalledWith(
          mockAcceptedCase,
        )

        expect(mockPut).toHaveBeenCalledWith(mockPdf, 'binary')

        expect(response.header).toHaveBeenCalledWith('Content-length', '16')

        expect(mockPipe).toHaveBeenCalledWith(response)

        expect(result).toBe(mockResponse)
      })
    })
  })
})

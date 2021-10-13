jest.mock('isomorphic-fetch', () => jest.fn())
import fetch from 'isomorphic-fetch'

import { uuid } from 'uuidv4'
import each from 'jest-each'

import { Test } from '@nestjs/testing'
import {
  BadGatewayException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import { LoggingModule } from '@island.is/logging'
import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { CaseState, User, UserRole } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { Case, CaseService } from '../case'

import { PoliceService } from './police.service'
import { PoliceController } from './police.controller'

describe('PoliceController', () => {
  let caseService: CaseService
  let policeController: PoliceController

  beforeEach(async () => {
    const policeModule = await Test.createTestingModule({
      imports: [
        LoggingModule,
        SharedAuthModule.register({
          jwtSecret: environment.auth.jwtSecret,
          secretToken: environment.auth.secretToken,
        }),
      ],
      controllers: [PoliceController],
      providers: [
        {
          provide: CaseService,
          useClass: jest.fn(() => ({
            findByIdAndUser: (id: string, _: User) =>
              Promise.resolve({ id } as Case),
          })),
        },
        PoliceService,
      ],
    }).compile()

    caseService = policeModule.get<CaseService>(CaseService)
    policeController = policeModule.get<PoliceController>(PoliceController)
  })

  describe('when getting police case files', () => {
    // RolesGuard blocks access for roles other than PROSECUTOR
    const prosecutor = { role: UserRole.PROSECUTOR } as User

    it('should throw for a non-existing (or blocked) case', async () => {
      const caseId = uuid()

      const mockFindByIdAndUser = jest.spyOn(caseService, 'findByIdAndUser')
      mockFindByIdAndUser.mockRejectedValueOnce(new Error('Some error'))

      await expect(
        policeController.getAllCaseFiles(caseId, prosecutor),
      ).rejects.toThrow('Some error')
    })

    each`
      state
      ${CaseState.ACCEPTED}
      ${CaseState.REJECTED}
      ${CaseState.DISMISSED}
    `.it('should throw for a $state case', async ({ state }) => {
      const caseId = uuid()

      const mockFindByIdAndUser = jest.spyOn(caseService, 'findByIdAndUser')
      mockFindByIdAndUser.mockImplementation((id: string) =>
        Promise.resolve({ id, state } as Case),
      )

      await expect(
        policeController.getAllCaseFiles(caseId, prosecutor),
      ).rejects.toThrow(ForbiddenException)
    })

    each`
      state
      ${CaseState.NEW}
      ${CaseState.DRAFT}
      ${CaseState.SUBMITTED}
      ${CaseState.RECEIVED}
    `.describe('geven a $state case', ({ state }) => {
      const caseId = uuid()

      beforeEach(() => {
        const mockFindByIdAndUser = jest.spyOn(caseService, 'findByIdAndUser')
        mockFindByIdAndUser.mockImplementation((id: string) =>
          Promise.resolve({ id, state } as Case),
        )
      })

      it('should trow if there are no police case files', async () => {
        const mockFetch = fetch as jest.Mock
        mockFetch.mockResolvedValueOnce({ ok: false })

        await expect(
          policeController.getAllCaseFiles(caseId, prosecutor),
        ).rejects.toThrow(NotFoundException)
      })

      it('should trow if remote call throws', async () => {
        const mockFetch = fetch as jest.Mock
        mockFetch.mockRejectedValueOnce(new Error('Some error'))

        await expect(
          policeController.getAllCaseFiles(caseId, prosecutor),
        ).rejects.toThrow(BadGatewayException)
      })

      it('should return police case files', async () => {
        const policeFiles = [
          { rvMalSkjolMals_ID: 'Id 1', heitiSkjals: 'Name 1' },
          { rvMalSkjolMals_ID: 'Id 2', heitiSkjals: 'Name 2' },
        ]

        const mockFetch = fetch as jest.Mock
        mockFetch.mockResolvedValueOnce({ ok: true, json: () => policeFiles })

        const res = await policeController.getAllCaseFiles(caseId, prosecutor)

        expect(res).toEqual([
          { id: 'Id 1', name: 'Name 1' },
          { id: 'Id 2', name: 'Name 2' },
        ])
      })
    })
  })
})

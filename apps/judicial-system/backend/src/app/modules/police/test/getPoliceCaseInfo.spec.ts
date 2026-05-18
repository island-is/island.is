import fetch from 'isomorphic-fetch'
import { v4 as uuid } from 'uuid'

import { NotFoundException } from '@nestjs/common'

import { CaseType, User } from '@island.is/judicial-system/types'

import { createTestingPoliceModule } from './createTestingPoliceModule'

import { IndictmentCountService } from '../../indictment-count/indictmentCount.service'
import { Case, CaseRepositoryService } from '../../repository'
import { PoliceCaseInfo } from '../models/policeCaseInfo.model'

jest.mock('isomorphic-fetch')

interface Then {
  result: PoliceCaseInfo[]
  error: Error & { detail: string }
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
) => Promise<Then>

describe('PoliceController - Get police case info', () => {
  let givenWhenThen: GivenWhenThen
  let assignDefendantPoliceCaseNumbers: jest.Mock
  let mockIndictmentCountService: IndictmentCountService
  let mockCaseRepositoryService: CaseRepositoryService

  beforeEach(async () => {
    ;(fetch as jest.Mock).mockReset()

    const {
      policeController,
      caseDefendantPoliceCaseNumberRepositoryService,
      indictmentCountService,
      caseRepositoryService,
    } = await createTestingPoliceModule()

    assignDefendantPoliceCaseNumbers =
      caseDefendantPoliceCaseNumberRepositoryService.assignDefendantPoliceCaseNumbers as jest.Mock
    mockIndictmentCountService = indictmentCountService
    mockCaseRepositoryService = caseRepositoryService

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
    ): Promise<Then> => {
      const then = {} as Then

      await policeController
        .getPoliceCaseInfo(caseId, user, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('police case info found', () => {
    const theUser = {} as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      defendants: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          nationalId: '0101302399',
          noNationalId: false,
        },
        { nationalId: '', noNationalId: false },
      ],
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      // getCaseUnitsFromPolice (GetRVMalseiningar)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            upprunalegtMalsnumer: '007-2021-000001',
            brotFra: '2021-02-23T13:17:00',
            licencePlate: 'ABC-123',
            gotuHeiti: 'Testgata',
            gotuNumer: '3',
            sveitafelag: 'Testbær',
            artalNrGreinLidur: null,
          },
          {
            upprunalegtMalsnumer: '007-2020-000103',
            brotFra: '2021-02-23T13:17:00',
            gotuHeiti: 'Teststígur',
            gotuNumer: null,
            sveitafelag: 'Testbær',
            licencePlate: 'CDE-123',
            artalNrGreinLidur: null,
          },
          {
            upprunalegtMalsnumer: '007-2020-000057',
            brotFra: '2021-02-23T13:17:00',
            gotuHeiti: 'Teststígur',
            gotuNumer: null,
            sveitafelag: null,
            licencePlate: null,
            artalNrGreinLidur: null,
          },
        ],
      })

      then = await givenWhenThen(caseId, theUser, theCase)
    })

    it('should return police case info from case units only', () => {
      expect(then.result).toEqual([
        {
          policeCaseNumber: '007-2021-000001',
          place: 'Testgata 3, Testbær',
          date: new Date('2021-02-23T13:17:00'),
          licencePlate: 'ABC-123',
          subtypes: [],
        },
        {
          policeCaseNumber: '007-2020-000103',
          date: new Date('2021-02-23T13:17:00'),
          place: 'Teststígur, Testbær',
          licencePlate: 'CDE-123',
          subtypes: [],
        },
        {
          date: new Date('2021-02-23T13:17:00'),
          policeCaseNumber: '007-2020-000057',
          place: 'Teststígur',
          licencePlate: undefined,
          subtypes: [],
        },
      ])
    })

    it('should not fetch police defendants when case has national ids', () => {
      const mockFetch = fetch as jest.Mock

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(
        mockFetch.mock.calls.some((call) =>
          (call[0] as string).includes('/GetRVAdilarMals/'),
        ),
      ).toBe(false)
    })

    it('should assign defendant-linked police case numbers from police case units', () => {
      expect(assignDefendantPoliceCaseNumbers).toHaveBeenCalledTimes(1)
      expect(assignDefendantPoliceCaseNumbers).toHaveBeenCalledWith(
        caseId,
        expect.arrayContaining([
          {
            defendantId: '11111111-1111-1111-1111-111111111111',
            policeCaseNumber: '007-2021-000001',
          },
          {
            defendantId: '11111111-1111-1111-1111-111111111111',
            policeCaseNumber: '007-2020-000103',
          },
          {
            defendantId: '11111111-1111-1111-1111-111111111111',
            policeCaseNumber: '007-2020-000057',
          },
        ]),
        expect.objectContaining({ transaction: expect.any(Object) }),
      )
    })
  })

  describe('indictment counts and auto-fill for indictment cases', () => {
    const theUser = {} as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          nationalId: '0101302399',
          noNationalId: false,
        },
      ],
    } as Case

    const policeResponse = [
      {
        upprunalegtMalsnumer: '007-2021-000001',
        brotFra: '2021-02-23T13:17:00',
        gotuHeiti: 'Testgata',
        gotuNumer: '3',
        sveitafelag: 'Testbær',
        artalNrGreinLidur: null,
      },
      {
        upprunalegtMalsnumer: '007-2020-000103',
        brotFra: '2021-02-23T13:17:00',
        gotuHeiti: null,
        gotuNumer: null,
        sveitafelag: null,
        artalNrGreinLidur: null,
      },
      {
        upprunalegtMalsnumer: '007-2020-000057',
        brotFra: '2021-02-23T13:17:00',
        gotuHeiti: null,
        gotuNumer: null,
        sveitafelag: null,
        artalNrGreinLidur: null,
      },
    ]

    describe('when some police case numbers are new and none have indictment counts', () => {
      let then: Then

      beforeEach(async () => {
        assignDefendantPoliceCaseNumbers.mockResolvedValueOnce([
          '007-2020-000103',
          '007-2020-000057',
        ])

        const mockFetch = fetch as jest.Mock
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => policeResponse,
        })

        then = await givenWhenThen(caseId, theUser, theCase)
      })

      it('should create indictment counts for all police case numbers missing them', () => {
        expect(
          mockIndictmentCountService.createWithPoliceCaseNumber,
        ).toHaveBeenCalledTimes(3)
        expect(
          mockIndictmentCountService.createWithPoliceCaseNumber,
        ).toHaveBeenCalledWith(caseId, '007-2021-000001', expect.any(Object))
        expect(
          mockIndictmentCountService.createWithPoliceCaseNumber,
        ).toHaveBeenCalledWith(caseId, '007-2020-000103', expect.any(Object))
        expect(
          mockIndictmentCountService.createWithPoliceCaseNumber,
        ).toHaveBeenCalledWith(caseId, '007-2020-000057', expect.any(Object))
      })

      it('should auto-fill crime scenes for all linked police case numbers', () => {
        expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
          caseId,
          expect.objectContaining({
            crimeScenes: expect.objectContaining({
              '007-2021-000001': {
                place: 'Testgata 3, Testbær',
                date: new Date('2021-02-23T13:17:00'),
              },
              '007-2020-000103': {
                place: '',
                date: new Date('2021-02-23T13:17:00'),
              },
              '007-2020-000057': {
                place: '',
                date: new Date('2021-02-23T13:17:00'),
              },
            }),
          }),
          expect.objectContaining({ transaction: expect.any(Object) }),
        )
      })

      it('should still return police case info', () => {
        expect(then.result).toHaveLength(3)
      })
    })

    describe('when all police case numbers already have indictment counts', () => {
      beforeEach(async () => {
        assignDefendantPoliceCaseNumbers.mockResolvedValueOnce([])
        ;(mockIndictmentCountService.findByCaseId as jest.Mock).mockResolvedValueOnce([
          { policeCaseNumber: '007-2021-000001' },
          { policeCaseNumber: '007-2020-000103' },
          { policeCaseNumber: '007-2020-000057' },
        ])

        const mockFetch = fetch as jest.Mock
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => policeResponse,
        })

        await givenWhenThen(caseId, theUser, theCase)
      })

      it('should not create any indictment counts', () => {
        expect(
          mockIndictmentCountService.createWithPoliceCaseNumber,
        ).not.toHaveBeenCalled()
      })
    })

    describe('when existing police case numbers are missing indictment counts', () => {
      beforeEach(async () => {
        assignDefendantPoliceCaseNumbers.mockResolvedValueOnce([])
        ;(mockIndictmentCountService.findByCaseId as jest.Mock).mockResolvedValueOnce([
          { policeCaseNumber: '007-2021-000001' },
        ])

        const mockFetch = fetch as jest.Mock
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => policeResponse,
        })

        await givenWhenThen(caseId, theUser, theCase)
      })

      it('should backfill the missing indictment counts', () => {
        expect(
          mockIndictmentCountService.createWithPoliceCaseNumber,
        ).toHaveBeenCalledTimes(2)
        expect(
          mockIndictmentCountService.createWithPoliceCaseNumber,
        ).toHaveBeenCalledWith(caseId, '007-2020-000103', expect.any(Object))
        expect(
          mockIndictmentCountService.createWithPoliceCaseNumber,
        ).toHaveBeenCalledWith(caseId, '007-2020-000057', expect.any(Object))
      })
    })

    describe('when crime scene data already exists', () => {
      beforeEach(async () => {
        assignDefendantPoliceCaseNumbers.mockResolvedValueOnce([])
        ;(mockIndictmentCountService.findByCaseId as jest.Mock).mockResolvedValueOnce([
          { policeCaseNumber: '007-2021-000001' },
          { policeCaseNumber: '007-2020-000103' },
          { policeCaseNumber: '007-2020-000057' },
        ])
        ;(mockCaseRepositoryService.findById as jest.Mock).mockResolvedValueOnce({
          crimeScenes: {
            '007-2021-000001': {
              place: 'User-entered place',
              date: new Date('2024-01-01'),
            },
            '007-2020-000103': {
              place: 'Another place',
              date: new Date('2024-02-01'),
            },
            '007-2020-000057': {
              place: 'Third place',
              date: new Date('2024-03-01'),
            },
          },
          indictmentSubtypes: {},
        })

        const mockFetch = fetch as jest.Mock
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => policeResponse,
        })

        await givenWhenThen(caseId, theUser, theCase)
      })

      it('should not overwrite existing crime scene data', () => {
        expect(mockCaseRepositoryService.update).not.toHaveBeenCalled()
      })
    })
  })

  describe('police case info found with no usable national ids on case', () => {
    const theUser = {} as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      defendants: [{ nationalId: '', noNationalId: false }],
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      // getDefendantsFromPolice
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            accusedNationalId: '0101302399',
            accusedName: 'Test Defendant',
          },
        ],
      })

      // getCaseUnitsFromPolice (GetRVMalseiningar)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            upprunalegtMalsnumer: '007-2021-000001',
            brotFra: '2021-02-23T13:17:00',
            licencePlate: 'ABC-123',
            gotuHeiti: 'Testgata',
            gotuNumer: '3',
            sveitafelag: 'Testbær',
            artalNrGreinLidur: null,
          },
        ],
      })

      then = await givenWhenThen(caseId, theUser, theCase)
    })

    it('should fetch police defendants as fallback', () => {
      const mockFetch = fetch as jest.Mock

      expect(assignDefendantPoliceCaseNumbers).not.toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(
        mockFetch.mock.calls.some((call) =>
          (call[0] as string).includes('/GetRVAdilarMals/'),
        ),
      ).toBe(true)
      expect(then.result).toEqual([
        {
          policeCaseNumber: '007-2021-000001',
          place: 'Testgata 3, Testbær',
          date: new Date('2021-02-23T13:17:00'),
          licencePlate: 'ABC-123',
          subtypes: [],
        },
      ])
    })
  })

  describe('police case info not found', () => {
    const user = {} as User
    const originalAncestorCaseId = uuid()
    const theCase = { id: originalAncestorCaseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      // getDefendantsFromPolice
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: () => 'Some error for getDefendantsFromPolice',
      })

      then = await givenWhenThen(uuid(), user, theCase)
    })

    it('should throw error exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Police defendants for case ${originalAncestorCaseId} do not exist`,
      )
    })
  })
})

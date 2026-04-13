import fetch from 'isomorphic-fetch'
import { v4 as uuid } from 'uuid'

import { NotFoundException } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { createTestingPoliceModule } from './createTestingPoliceModule'

import { Case } from '../../repository'
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
  let upsertAssignedDefendantPoliceCaseNumbers: jest.Mock

  beforeEach(async () => {
    ;(fetch as jest.Mock).mockReset()

    const { policeController, caseDefendantPoliceCaseNumberRepositoryService } =
      await createTestingPoliceModule()

    upsertAssignedDefendantPoliceCaseNumbers =
      caseDefendantPoliceCaseNumberRepositoryService
        .upsertAssignedDefendantPoliceCaseNumbers as jest.Mock

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
        { id: '11111111-1111-1111-1111-111111111111', nationalId: '0101302399', noNationalId: false },
        { nationalId: '', noNationalId: false },
      ],
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      // getPoliceCaseFiles
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          malsnumer: '007-2021-000001',
          skjol: [
            {
              dagsStofnad: '2020-01-01',
              domsSkjalsFlokkun: 'dsf1',
              rvMalSkjolMals_ID: 1,
              heitiSkjals: 'Name 1.pdf',
              malsnumer: '007-2021-000001',
            },
            {
              dagsStofnad: '2020-01-01',
              domsSkjalsFlokkun: 'dsf1',
              rvMalSkjolMals_ID: 1,
              heitiSkjals: 'Name 1.pdf',
              malsnumer: '007-2020-000103',
            },
            {
              dagsStofnad: '2020-01-01',
              domsSkjalsFlokkun: 'dsf1',
              rvMalSkjolMals_ID: 1,
              heitiSkjals: 'Name 1.pdf',
              malsnumer: '007-2020-000057',
            },
            {
              dagsStofnad: '2020-01-01',
              domsSkjalsFlokkun: 'dsf1',
              rvMalSkjolMals_ID: 1,
              heitiSkjals: 'Name 1.pdf',
              malsnumer: '008-2013-000033',
            },
            {
              dagsStofnad: '2020-01-01',
              domsSkjalsFlokkun: 'dsf1',
              rvMalSkjolMals_ID: 1,
              heitiSkjals: 'Name 1.pdf',
              malsnumer: '008-2013-000033',
            },
          ],
        }),
      })

      // getDigitalCaseFiles
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            malsnumer: '007-2026-000001',
            gogn: [
              {
                id: '0123aaae-fa94-4196-9f78-2b1d44c6650e',
                rvMalID: 620,
                externalVendorFileName:
                  '007-2026-000001 HP101 Upptaka 3 - 20260113152254',
                externalVendorID: '2342',
                registeredAt: '2026-03-03T15:33:58.967',
                registeredBy: '00000000-0000-0000-0000-000000000000',
                stmID: 24836,
                objectType: 0,
                fkMalMalaskraId: 2706240,
              },
            ],
          },
          {
            malsnumer: '007-2026-000002',
            gogn: [
              {
                id: 'd0d2abe3-8eeb-4e32-9f3b-897aebc6aa54',
                rvMalID: 620,
                externalVendorFileName: '007-2026-000002 0101 20260127151639',
                externalVendorID: '2345',
                registeredAt: '2026-03-03T15:33:58.967',
                registeredBy: '00000000-0000-0000-0000-000000000000',
                stmID: 24836,
                objectType: 0,
                fkMalMalaskraId: 2706242,
              },
            ],
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

    it('should return police case info without duplicates', () => {
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
        { policeCaseNumber: '008-2013-000033' },
        { policeCaseNumber: '007-2026-000001' },
        { policeCaseNumber: '007-2026-000002' },
      ])
    })

    it('should not fetch police defendants when case has national ids', () => {
      const mockFetch = fetch as jest.Mock

      expect(mockFetch).toHaveBeenCalledTimes(3)
      expect(
        mockFetch.mock.calls.some((call) =>
          (call[0] as string).includes('/GetRVAdilarMals/'),
        ),
      ).toBe(false)
    })

    it('should upsert defendant-linked police case numbers from LÖKE case units', () => {
      expect(upsertAssignedDefendantPoliceCaseNumbers).toHaveBeenCalledTimes(1)
      expect(upsertAssignedDefendantPoliceCaseNumbers).toHaveBeenCalledWith(
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
      )
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
      // getPoliceCaseFiles
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          malsnumer: '007-2021-000001',
          skjol: [],
        }),
      })

      // getDigitalCaseFiles
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

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

      expect(upsertAssignedDefendantPoliceCaseNumbers).not.toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledTimes(4)
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
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: () => 'Some error for getPoliceCaseFilesAndPoliceCaseUnits',
      })
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: () => 'Some error for getDigitalCaseFiles',
      })

      then = await givenWhenThen(uuid(), user, theCase)
    })

    it('should throw error exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Police case for case ${originalAncestorCaseId} does not exist`,
      )
    })
  })
})

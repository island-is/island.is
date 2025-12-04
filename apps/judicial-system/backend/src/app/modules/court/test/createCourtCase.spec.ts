import formatISO from 'date-fns/formatISO'
import each from 'jest-each'
import { uuid } from 'uuidv4'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import {
  CaseType,
  courtSubtypes,
  IndictmentSubtype,
  IndictmentSubtypeMap,
  investigationCases,
  isIndictmentCase,
  Subtype,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCourtModule } from './createTestingCourtModule'

import { randomBoolean, randomDate, randomEnum } from '../../../test'

interface Then {
  result: string
  error: Error
}

type GivenWhenThen = (
  user: User,
  caseId: string,
  courtId: string,
  type: CaseType,
  receivalDate: Date,
  policeCaseNumbers: string[],
  isExtension: boolean,
  indictmentSubtypes?: IndictmentSubtypeMap,
) => Promise<Then>

describe('CourtService - Create court case', () => {
  const receivalDate = randomDate()
  let mockCourtClientService: CourtClientService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtClientService, courtService } =
      await createTestingCourtModule()

    mockCourtClientService = courtClientService

    givenWhenThen = async (
      user: User,
      caseId: string,
      courtId: string,
      type: CaseType,
      receivalDate: Date,
      policeCaseNumbers: string[],
      isExtension: boolean,
      indictmentSubtypes?: IndictmentSubtypeMap,
    ) => {
      const then = {} as Then

      try {
        then.result = await courtService.createCourtCase(
          user,
          caseId,
          courtId,
          type,
          receivalDate,
          policeCaseNumbers,
          isExtension,
          indictmentSubtypes,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each([...investigationCases, CaseType.ADMISSION_TO_FACILITY])(
    'court case created for %s',
    (type) => {
      const user = {} as User
      const caseId = uuid()
      const courtId = uuid()
      const policeCaseNumbers = [uuid()]
      const isExtension = false

      beforeEach(async () => {
        await givenWhenThen(
          user,
          caseId,
          courtId,
          type,
          receivalDate,
          policeCaseNumbers,
          isExtension,
        )
      })

      it('should create a court case', () => {
        expect(mockCourtClientService.createCase).toHaveBeenCalledWith(
          courtId,
          {
            caseType: 'R - Rannsóknarmál',
            subtype: courtSubtypes[type as Subtype],
            status: 'Skráð',
            receivalDate: formatISO(receivalDate, { representation: 'date' }),
            basedOn: 'Rannsóknarhagsmunir',
            sourceNumber: policeCaseNumbers[0].replace(/-/g, ''),
          },
        )
      })
    },
  )

  describe.each(Object.values(IndictmentSubtype))(
    'indictment court case created for %s',
    (indictmentSubtype) => {
      const user = {} as User
      const caseId = uuid()
      const type = CaseType.INDICTMENT
      const courtId = uuid()
      const policeCaseNumber = uuid()
      const indictmentSubtypes = { [policeCaseNumber]: [indictmentSubtype] }
      const policeCaseNumbers = [policeCaseNumber]
      const isExtension = false

      beforeEach(async () => {
        await givenWhenThen(
          user,
          caseId,
          courtId,
          type,
          receivalDate,
          policeCaseNumbers,
          isExtension,
          indictmentSubtypes,
        )
      })

      it('should create a court case', () => {
        expect(mockCourtClientService.createCase).toHaveBeenCalledWith(
          courtId,
          {
            caseType: 'S - Ákærumál',
            subtype: courtSubtypes[indictmentSubtype],
            status: 'Skráð',
            receivalDate: formatISO(receivalDate, { representation: 'date' }),
            basedOn: 'Sakamál',
            sourceNumber: policeCaseNumbers[0].replace(/-/g, ''),
          },
        )
      })
    },
  )

  each`
    type
    ${CaseType.CUSTODY}
    ${CaseType.TRAVEL_BAN}
  `.describe('extendable court case created for $type', ({ type }) => {
    const user = {} as User
    const caseId = uuid()
    const courtId = uuid()
    const policeCaseNumbers = [uuid()]
    const isExtension = false

    beforeEach(async () => {
      await givenWhenThen(
        user,
        caseId,
        courtId,
        type,
        receivalDate,
        policeCaseNumbers,
        isExtension,
      )
    })

    it('should create a court case', () => {
      expect(mockCourtClientService.createCase).toHaveBeenCalledWith(courtId, {
        caseType: 'R - Rannsóknarmál',
        subtype: courtSubtypes[type as Subtype][0],
        status: 'Skráð',
        receivalDate: formatISO(receivalDate, { representation: 'date' }),
        basedOn: 'Rannsóknarhagsmunir',
        sourceNumber: policeCaseNumbers[0].replace(/-/g, ''),
      })
    })
  })

  each`
    type
    ${CaseType.CUSTODY}
    ${CaseType.TRAVEL_BAN}
  `.describe('extended court case created for $type', ({ type }) => {
    const user = {} as User
    const caseId = uuid()
    const courtId = uuid()
    const policeCaseNumbers = [uuid()]
    const isExtension = true

    beforeEach(async () => {
      await givenWhenThen(
        user,
        caseId,
        courtId,
        type,
        receivalDate,
        policeCaseNumbers,
        isExtension,
      )
    })

    it('should create a court case', () => {
      expect(mockCourtClientService.createCase).toHaveBeenCalledWith(courtId, {
        caseType: 'R - Rannsóknarmál',
        subtype: courtSubtypes[type as Subtype][1],
        status: 'Skráð',
        receivalDate: formatISO(receivalDate, { representation: 'date' }),
        basedOn: 'Rannsóknarhagsmunir',
        sourceNumber: policeCaseNumbers[0].replace(/-/g, ''),
      })
    })
  })

  describe('court case number returned', () => {
    const user = {} as User
    const caseId = uuid()
    const courtId = uuid()
    const type = randomEnum(CaseType)
    const indictmentSubtype = isIndictmentCase(type)
      ? randomEnum(IndictmentSubtype)
      : undefined
    const policeCaseNumber = uuid()
    const indictmentSubtypes = indictmentSubtype
      ? { [policeCaseNumber]: [indictmentSubtype] }
      : undefined
    const policeCaseNumbers = [policeCaseNumber]
    const courtCaseNumber = uuid()
    const isExtension = randomBoolean()
    let then: Then

    beforeEach(async () => {
      const mockCreateCase = mockCourtClientService.createCase as jest.Mock
      mockCreateCase.mockResolvedValueOnce(courtCaseNumber)

      then = await givenWhenThen(
        user,
        caseId,
        courtId,
        type,
        receivalDate,
        policeCaseNumbers,
        isExtension,
        indictmentSubtypes,
      )
    })

    it('should return a court case number', () => {
      expect(then.result).toBe(courtCaseNumber)
    })
  })

  describe('create court case failes', () => {
    const user = {} as User
    const caseId = uuid()
    const courtId = uuid()
    const type = randomEnum(CaseType)
    const indictmentSubtype = isIndictmentCase(type)
      ? randomEnum(IndictmentSubtype)
      : undefined
    const policeCaseNumber = uuid()
    const indictmentSubtypes = indictmentSubtype
      ? { [policeCaseNumber]: [indictmentSubtype] }
      : undefined
    const policeCaseNumbers = [policeCaseNumber]
    const isExtension = randomBoolean()
    let then: Then

    beforeEach(async () => {
      const mockCreateCase = mockCourtClientService.createCase as jest.Mock
      mockCreateCase.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(
        user,
        caseId,
        courtId,
        type,
        receivalDate,
        policeCaseNumbers,
        isExtension,
        indictmentSubtypes,
      )
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

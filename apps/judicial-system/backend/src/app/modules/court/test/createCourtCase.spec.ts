import { uuid } from 'uuidv4'
import formatISO from 'date-fns/formatISO'
import each from 'jest-each'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import {
  CaseType,
  IndictmentSubType,
  investigationCases,
  isIndictmentCase,
  User,
} from '@island.is/judicial-system/types'

import { randomBoolean, randomDate, randomEnum } from '../../../test'
import { nowFactory } from '../../../factories'
import { courtSubTypes, SubType } from '../court.service'
import { createTestingCourtModule } from './createTestingCourtModule'

jest.mock('../../../factories')

interface Then {
  result: string
  error: Error
}

type GivenWhenThen = (
  user: User,
  caseId: string,
  courtId: string,
  type: CaseType,
  policeCaseNumbers: string[],
  isExtension: boolean,
  indictmentSubType?: IndictmentSubType,
) => Promise<Then>

describe('CourtService - Create court case', () => {
  const date = randomDate()
  let mockCourtClientService: CourtClientService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      courtClientService,
      courtService,
    } = await createTestingCourtModule()

    mockCourtClientService = courtClientService

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)

    givenWhenThen = async (
      user: User,
      caseId: string,
      courtId: string,
      type: CaseType,
      policeCaseNumbers: string[],
      isExtension: boolean,
      indictmentSubType?: IndictmentSubType,
    ) => {
      const then = {} as Then

      try {
        then.result = await courtService.createCourtCase(
          user,
          caseId,
          courtId,
          type,
          policeCaseNumbers,
          isExtension,
          indictmentSubType,
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
          policeCaseNumbers,
          isExtension,
        )
      })

      it('should create a court case', () => {
        expect(mockCourtClientService.createCase).toHaveBeenCalledWith(
          courtId,
          {
            caseType: 'R - Rannsóknarmál',
            subtype: courtSubTypes[type as SubType],
            status: 'Skráð',
            receivalDate: formatISO(date, { representation: 'date' }),
            basedOn: 'Rannsóknarhagsmunir',
            sourceNumber: policeCaseNumbers[0],
          },
        )
      })
    },
  )

  describe.each(Object.values(IndictmentSubType))(
    'indictment court case created for %s',
    (indictmentSubType) => {
      const user = {} as User
      const caseId = uuid()
      const type = CaseType.INDICTMENT
      const courtId = uuid()
      const policeCaseNumbers = [uuid()]
      const isExtension = false

      beforeEach(async () => {
        await givenWhenThen(
          user,
          caseId,
          courtId,
          type,
          policeCaseNumbers,
          isExtension,
          indictmentSubType,
        )
      })

      it('should create a court case', () => {
        expect(mockCourtClientService.createCase).toHaveBeenCalledWith(
          courtId,
          {
            caseType: 'S - Ákærumál',
            subtype: courtSubTypes[indictmentSubType],
            status: 'Skráð',
            receivalDate: formatISO(date, { representation: 'date' }),
            basedOn: 'Sakamál',
            sourceNumber: policeCaseNumbers[0],
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
        policeCaseNumbers,
        isExtension,
      )
    })

    it('should create a court case', () => {
      expect(mockCourtClientService.createCase).toHaveBeenCalledWith(courtId, {
        caseType: 'R - Rannsóknarmál',
        subtype: courtSubTypes[type as SubType][0],
        status: 'Skráð',
        receivalDate: formatISO(date, { representation: 'date' }),
        basedOn: 'Rannsóknarhagsmunir',
        sourceNumber: policeCaseNumbers[0],
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
        policeCaseNumbers,
        isExtension,
      )
    })

    it('should create a court case', () => {
      expect(mockCourtClientService.createCase).toHaveBeenCalledWith(courtId, {
        caseType: 'R - Rannsóknarmál',
        subtype: courtSubTypes[type as SubType][1],
        status: 'Skráð',
        receivalDate: formatISO(date, { representation: 'date' }),
        basedOn: 'Rannsóknarhagsmunir',
        sourceNumber: policeCaseNumbers[0],
      })
    })
  })

  describe('court case number returned', () => {
    const user = {} as User
    const caseId = uuid()
    const courtId = uuid()
    const type = randomEnum(CaseType)
    const indictmentSubType = isIndictmentCase(type)
      ? randomEnum(IndictmentSubType)
      : undefined
    const policeCaseNumbers = [uuid()]
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
        policeCaseNumbers,
        isExtension,
        indictmentSubType,
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
    const policeCaseNumbers = [uuid()]
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
        policeCaseNumbers,
        isExtension,
      )
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

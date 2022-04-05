import { uuid } from 'uuidv4'
import formatISO from 'date-fns/formatISO'
import each from 'jest-each'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import { CaseType, User } from '@island.is/judicial-system/types'

import { randomBoolean, randomDate, randomEnum } from '../../../test'
import { now } from '../../../factories'
import { subTypes } from '../court.service'
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
  policeCaseNumber: string,
  isExtension: boolean,
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

    const mockToday = now as jest.Mock
    mockToday.mockReturnValueOnce(date)

    givenWhenThen = async (
      user: User,
      caseId: string,
      courtId: string,
      type: CaseType,
      policeCaseNumber: string,
      isExtension: boolean,
    ) => {
      const then = {} as Then

      try {
        then.result = await courtService.createCourtCase(
          user,
          caseId,
          courtId,
          type,
          policeCaseNumber,
          isExtension,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  each`
    type
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
    ${CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION}
    ${CaseType.VIDEO_RECORDING_EQUIPMENT}
    ${CaseType.OTHER}
  `.describe('court case created for $type', ({ type }) => {
    const user = {} as User
    const caseId = uuid()
    const courtId = uuid()
    const policeCaseNumber = uuid()
    const isExtension = false

    beforeEach(async () => {
      await givenWhenThen(
        user,
        caseId,
        courtId,
        type,
        policeCaseNumber,
        isExtension,
      )
    })

    it('should create a court case', () => {
      expect(mockCourtClientService.createCase).toHaveBeenCalledWith(courtId, {
        caseType: 'R - Rannsóknarmál',
        subtype: subTypes[type as CaseType],
        status: 'Skráð',
        receivalDate: formatISO(date, { representation: 'date' }),
        basedOn: 'Rannsóknarhagsmunir',
        sourceNumber: policeCaseNumber,
      })
    })
  })

  each`
    type
    ${CaseType.CUSTODY}
    ${CaseType.TRAVEL_BAN}
    ${CaseType.ADMISSION_TO_FACILITY}
  `.describe('extendable court case created for $type', ({ type }) => {
    const user = {} as User
    const caseId = uuid()
    const courtId = uuid()
    const policeCaseNumber = uuid()
    const isExtension = false

    beforeEach(async () => {
      await givenWhenThen(
        user,
        caseId,
        courtId,
        type,
        policeCaseNumber,
        isExtension,
      )
    })

    it('should create a court case', () => {
      expect(mockCourtClientService.createCase).toHaveBeenCalledWith(courtId, {
        caseType: 'R - Rannsóknarmál',
        subtype: subTypes[type as CaseType][0],
        status: 'Skráð',
        receivalDate: formatISO(date, { representation: 'date' }),
        basedOn: 'Rannsóknarhagsmunir',
        sourceNumber: policeCaseNumber,
      })
    })
  })

  each`
    type
    ${CaseType.CUSTODY}
    ${CaseType.TRAVEL_BAN}
    ${CaseType.ADMISSION_TO_FACILITY}
  `.describe('extended court case created for $type', ({ type }) => {
    const user = {} as User
    const caseId = uuid()
    const courtId = uuid()
    const policeCaseNumber = uuid()
    const isExtension = true

    beforeEach(async () => {
      await givenWhenThen(
        user,
        caseId,
        courtId,
        type,
        policeCaseNumber,
        isExtension,
      )
    })

    it('should create a court case', () => {
      expect(mockCourtClientService.createCase).toHaveBeenCalledWith(courtId, {
        caseType: 'R - Rannsóknarmál',
        subtype: subTypes[type as CaseType][1],
        status: 'Skráð',
        receivalDate: formatISO(date, { representation: 'date' }),
        basedOn: 'Rannsóknarhagsmunir',
        sourceNumber: policeCaseNumber,
      })
    })
  })

  describe('court case number returned', () => {
    const user = {} as User
    const caseId = uuid()
    const courtId = uuid()
    const type = randomEnum(CaseType)
    const policeCaseNumber = uuid()
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
        policeCaseNumber,
        isExtension,
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
    const policeCaseNumber = uuid()
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
        policeCaseNumber,
        isExtension,
      )
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

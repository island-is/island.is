import { Transaction } from 'sequelize'

import {
  CaseType,
  RequestSharedWithDefender,
  User,
} from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import {
  Case,
  CaseRepositoryService,
  Defendant,
  DefendantRepositoryService,
} from '../../../repository'
import { UpdateDefendantDto } from '../../dto/updateDefendant.dto'

interface Then {
  result?: Defendant
  error?: Error
}

type GivenWhenThen = (
  defendant: Defendant,
  update: UpdateDefendantDto,
) => Promise<Then>

describe('DefendantService - update', () => {
  const theCase = { id: 'case-id', type: CaseType.CUSTODY } as Case
  const user = { id: 'user-id' } as User
  const transaction = {} as Transaction

  let mockDefendantRepositoryService: DefendantRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { defendantRepositoryService, defendantService } =
      await createTestingDefendantModule()

    mockDefendantRepositoryService = defendantRepositoryService

    givenWhenThen = async (
      defendant: Defendant,
      update: UpdateDefendantDto,
    ) => {
      const then: Then = {}

      try {
        then.result = await defendantService.update(
          theCase,
          defendant,
          update,
          user,
          transaction,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('when defenderNationalId is null', () => {
    const defendant = {
      id: 'defendant-id',
      caseId: theCase.id,
      defenderNationalId: '0101302399',
      defenderName: 'Defender Name',
    } as Defendant
    const update = {
      defenderNationalId: null,
    } as unknown as UpdateDefendantDto
    const updatedDefendant = { ...defendant } as unknown as Defendant
    let then: Then

    beforeEach(async () => {
      ;(
        mockDefendantRepositoryService.update as jest.Mock
      ).mockResolvedValueOnce(updatedDefendant)

      then = await givenWhenThen(defendant, update)
    })

    it('should strip defenderNationalId from the update', () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
        theCase.id,
        defendant.id,
        {},
        { transaction },
      )
      expect(then.result).toEqual(updatedDefendant)
    })
  })

  describe('when defenderNationalId and defenderName are both set to null', () => {
    const defendant = {
      id: 'defendant-id',
      caseId: theCase.id,
      defenderNationalId: '0101302399',
      defenderName: 'Defender Name',
      defenderEmail: 'defender@example.com',
      defenderPhoneNumber: '5551234',
    } as Defendant
    const update = {
      defenderNationalId: null,
      defenderName: null,
    } as unknown as UpdateDefendantDto
    const updatedDefendant = {
      ...defendant,
      defenderName: null,
    } as unknown as Defendant
    let then: Then

    beforeEach(async () => {
      ;(
        mockDefendantRepositoryService.update as jest.Mock
      ).mockResolvedValueOnce(updatedDefendant)

      then = await givenWhenThen(defendant, update)
    })

    it('should strip defenderNationalId but preserve defenderName', () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
        theCase.id,
        defendant.id,
        { defenderName: null },
        { transaction },
      )
      expect(then.result).toEqual(updatedDefendant)
    })
  })

  describe('when all defender fields are set to null', () => {
    const defendant = {
      id: 'defendant-id',
      caseId: theCase.id,
      defenderNationalId: '0101302399',
      defenderName: 'Defender Name',
      defenderEmail: 'defender@example.com',
      defenderPhoneNumber: '5551234',
    } as Defendant
    const update = {
      defenderNationalId: null,
      defenderName: null,
      defenderEmail: null,
      defenderPhoneNumber: null,
    } as unknown as UpdateDefendantDto
    const updatedDefendant = { ...defendant, ...update } as unknown as Defendant
    let then: Then

    beforeEach(async () => {
      ;(
        mockDefendantRepositoryService.update as jest.Mock
      ).mockResolvedValueOnce(updatedDefendant)

      then = await givenWhenThen(defendant, update)
    })

    it('should not strip defenderNationalId', () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
        theCase.id,
        defendant.id,
        update,
        { transaction },
      )
      expect(then.result).toEqual(updatedDefendant)
    })
  })

  describe('when requestSharedWithDefender changes on a request case', () => {
    const defendant = {
      id: 'defendant-id',
      caseId: theCase.id,
      requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
    } as Defendant
    const otherDefendant = {
      id: 'other-defendant-id',
      caseId: theCase.id,
      requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
    } as Defendant
    const caseWithDefendants = {
      ...theCase,
      defendants: [defendant, otherDefendant],
      requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
    } as Case
    const update = {
      requestSharedWithDefender: RequestSharedWithDefender.READY_FOR_COURT,
    } as UpdateDefendantDto
    const updatedDefendant = {
      ...defendant,
      requestSharedWithDefender: RequestSharedWithDefender.READY_FOR_COURT,
    } as Defendant
    let mockCaseRepositoryService: CaseRepositoryService

    beforeEach(async () => {
      const {
        defendantRepositoryService,
        caseRepositoryService,
        defendantService,
      } = await createTestingDefendantModule()

      mockDefendantRepositoryService = defendantRepositoryService
      mockCaseRepositoryService = caseRepositoryService
      ;(
        mockDefendantRepositoryService.update as jest.Mock
      ).mockResolvedValueOnce(updatedDefendant)

      givenWhenThen = async (defendantArg, updateArg) => {
        const then: Then = {}

        try {
          then.result = await defendantService.update(
            caseWithDefendants,
            defendantArg,
            updateArg,
            user,
            transaction,
          )
        } catch (error) {
          then.error = error as Error
        }

        return then
      }

      await givenWhenThen(defendant, update)
    })

    it('should mirror the most permissive sharing timing onto the case', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        theCase.id,
        {
          requestSharedWithDefender: RequestSharedWithDefender.READY_FOR_COURT,
        },
        { transaction },
      )
    })
  })
})

import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { CourtSessionStringType } from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import { runInRequestContext } from '../../../../test'
import {
  CourtSessionString,
  CourtSessionStringRepositoryService,
} from '../../../repository'
import { CourtSessionStringDto } from '../../dto/CourtSessionStringDto.dto'

interface Then {
  result: CourtSessionString
  error: Error
}

type GivenWhenThen = (update: CourtSessionStringDto) => Promise<Then>

// The one route on this controller that never opened a transaction of its
// own. The class-level guard now holds the case row for the request, so the
// string's read and write join that transaction instead of autocommitting
// beside a lock held on their behalf.
describe('CourtSessionController - Create or update court session string', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const mergedCaseId = uuid()
  const key = {
    caseId,
    courtSessionId,
    mergedCaseId,
    stringType: CourtSessionStringType.ENTRIES,
  }

  let transaction: Transaction
  let mockCourtSessionStringRepositoryService: CourtSessionStringRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      courtSessionStringRepositoryService,
      courtSessionController,
    } = await createTestingCourtSessionModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    mockCourtSessionStringRepositoryService =
      courtSessionStringRepositoryService

    givenWhenThen = async (update) => {
      const then = {} as Then

      try {
        // The routes are guarded by CaseExistsForUpdateGuard, so the request
        // transaction is already open by the time the handler runs. Guards do
        // not execute in controller unit tests, so the request context is set
        // up here instead.
        await runInRequestContext(async () => {
          then.result =
            await courtSessionController.createOrUpdateCourtSessionString(
              caseId,
              courtSessionId,
              update,
            )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('no string exists for the key', () => {
    const created = {
      id: uuid(),
      ...key,
      value: 'Some text',
    } as CourtSessionString
    let then: Then

    beforeEach(async () => {
      ;(
        mockCourtSessionStringRepositoryService.findByKey as jest.Mock
      ).mockResolvedValueOnce(null)
      ;(
        mockCourtSessionStringRepositoryService.create as jest.Mock
      ).mockResolvedValueOnce(created)

      then = await givenWhenThen({
        mergedCaseId,
        stringType: CourtSessionStringType.ENTRIES,
        value: 'Some text',
      })
    })

    it('should look the string up in the request transaction', () => {
      expect(
        mockCourtSessionStringRepositoryService.findByKey,
      ).toHaveBeenCalledWith(key, { transaction })
    })

    it('should create the string in the request transaction', () => {
      expect(
        mockCourtSessionStringRepositoryService.create,
      ).toHaveBeenCalledWith({ ...key, value: 'Some text' }, { transaction })
      expect(then.result).toBe(created)
    })
  })

  describe('a string exists for the key', () => {
    const updated = {
      id: uuid(),
      ...key,
      value: 'New text',
    } as CourtSessionString
    let then: Then

    beforeEach(async () => {
      ;(
        mockCourtSessionStringRepositoryService.findByKey as jest.Mock
      ).mockResolvedValueOnce({ id: updated.id, ...key, value: 'Old text' })
      ;(
        mockCourtSessionStringRepositoryService.updateByKey as jest.Mock
      ).mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        courtSessionStrings: [updated],
      })

      then = await givenWhenThen({
        mergedCaseId,
        stringType: CourtSessionStringType.ENTRIES,
        value: 'New text',
      })
    })

    it('should update the string in the request transaction', () => {
      expect(
        mockCourtSessionStringRepositoryService.updateByKey,
      ).toHaveBeenCalledWith(key, { value: 'New text' }, { transaction })
      expect(
        mockCourtSessionStringRepositoryService.create,
      ).not.toHaveBeenCalled()
      expect(then.result).toBe(updated)
    })
  })
})

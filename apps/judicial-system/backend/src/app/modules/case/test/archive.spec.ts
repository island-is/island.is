import { Transaction } from 'sequelize/types'

import { createTestingCaseModule } from './createTestingCaseModule'
import { ArchiveResponse } from '../models/archive.response'

interface Then {
  result: ArchiveResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('CaseController - Archive', () => {
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, caseController } = await createTestingCaseModule()
    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async () => {
      const then = {} as Then

      await caseController
        .archive()
        .then((res) => (then.result = res))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('archive case', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should fail', () => {
      expect(then.result).toEqual({ caseArchived: false })
    })
  })
})

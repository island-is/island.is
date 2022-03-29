import { literal, Op } from 'sequelize'
import { Transaction } from 'sequelize/types'

import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from './createTestingCaseModule'
import { User } from '../../user'
import { Institution } from '../../institution'
import { Defendant } from '../../defendant/models/defendant.model'
import { ArchiveResponse } from '../models/archive.response'
import { Case } from '../models/case.model'

interface Then {
  result: ArchiveResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('CaseController - Archive', () => {
  let mockCaseModel: typeof Case
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockCaseModel = caseModel

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

  describe('case lookup', () => {
    beforeEach(async () => {
      await givenWhenThen()
    })

    it('should lookup a case', () => {
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        include: [
          { model: Defendant, as: 'defendants' },
          { model: Institution, as: 'court' },
          {
            model: User,
            as: 'creatingProsecutor',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: User,
            as: 'prosecutor',
            include: [{ model: Institution, as: 'institution' }],
          },
          { model: Institution, as: 'sharedWithProsecutorsOffice' },
          {
            model: User,
            as: 'judge',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: User,
            as: 'registrar',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: User,
            as: 'courtRecordSignatory',
            include: [{ model: Institution, as: 'institution' }],
          },
          { model: Case, as: 'parentCase' },
          { model: Case, as: 'childCase' },
        ],
        order: [[{ model: Defendant, as: 'defendants' }, 'created', 'ASC']],
        where: {
          arvhived: false,
          [Op.or]: [
            { state: CaseState.DELETED },
            {
              [Op.or]: [
                {
                  [Op.and]: [
                    { state: [CaseState.REJECTED, CaseState.DISMISSED] },
                    { ruling_date: { [Op.lt]: literal('current_date - 90') } },
                  ],
                },
                {
                  [Op.and]: [
                    {
                      state: [
                        CaseState.NEW,
                        CaseState.DRAFT,
                        CaseState.SUBMITTED,
                        CaseState.RECEIVED,
                      ],
                    },
                    { created: { [Op.lt]: literal('current_date - 90') } },
                  ],
                },
                {
                  [Op.and]: [
                    { type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN] },
                    { state: CaseState.ACCEPTED },
                    {
                      valid_to_date: { [Op.lt]: literal('current_date - 90') },
                    },
                  ],
                },
                {
                  [Op.and]: [
                    {
                      [Op.not]: {
                        type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN],
                      },
                    },
                    { state: CaseState.ACCEPTED },
                    { ruling_date: { [Op.lt]: literal('current_date - 90') } },
                  ],
                },
              ],
            },
          ],
        },
      })
    })
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

  describe('no case found', () => {
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(null)

      then = await givenWhenThen()
    })

    it('should not archive a case', () => {
      expect(then.result).toEqual({ caseArchived: false })
    })
  })
})

import { uuid } from 'uuidv4'

import { ForbiddenException } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { Case } from '../../models/case.model'
import { SignatureConfirmationResponse } from '../../models/signatureConfirmation.response'
import { createTestingCaseModule } from '../createTestingCaseModule'

interface Then {
  result: SignatureConfirmationResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
  documentToken: string,
) => Promise<Then>

describe('CaseController - Get ruling signature confirmation', () => {
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseModel, caseController } = await createTestingCaseModule()

    mockCaseModel = caseModel

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
      documentToken: string,
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.getRulingSignatureConfirmation(
          caseId,
          user,
          theCase,
          documentToken,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('database update', () => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: userId } as Case
    const documentToken = uuid()

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should set the ruling date', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { rulingDate: expect.any(Date) },
        { where: { id: caseId } },
      )
    })
  })

  describe('successful completion', () => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: userId } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [theCase]])

      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ documentSigned: true })
    })
  })

  describe('user is not the assigned judge', () => {
    const user = { id: uuid() } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: uuid() } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'A ruling must be signed by the assigned judge',
      )
    })
  })

  describe('database update fails', () => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: userId } as Case
    const documentToken = uuid()
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase, documentToken)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

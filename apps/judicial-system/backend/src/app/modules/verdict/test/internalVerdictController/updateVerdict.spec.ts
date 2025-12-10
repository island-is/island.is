import { uuid } from 'uuidv4'

import { VerdictServiceStatus } from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { Case, Verdict, VerdictRepositoryService } from '../../../repository'
import { PoliceUpdateVerdictDto } from '../../dto/policeUpdateVerdict.dto'

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalVerdictController - Update verdict', () => {
  const verdictId = uuid()
  const externalPoliceDocumentId = uuid()

  const defendantId1 = uuid()
  const caseId = uuid()
  const policeCaseNumber = uuid()
  const courtCaseNumber = uuid()
  const policeCaseNumbers = [uuid(), policeCaseNumber, uuid()]
  const caseFileId = uuid()
  const caseFile = { id: caseFileId, caseId, policeCaseNumber }
  const theCase = {
    id: caseId,
    defendants: [{ id: defendantId1 }],
    policeCaseNumbers,
    caseFiles: [caseFile],
    courtCaseNumber,
  } as Case
  const verdict = {
    id: verdictId,
    caseId,
    defendantId: defendantId1,
    externalPoliceDocumentId,
  } as Verdict

  const dto = {
    serviceDate: new Date(2025, 1, 1),
    serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
    comment: 'test',
  } as PoliceUpdateVerdictDto

  let mockVerdictRepositoryService: VerdictRepositoryService

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { internalVerdictController, verdictRepositoryService } =
      await createTestingVerdictModule()

    mockVerdictRepositoryService = verdictRepositoryService

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      await internalVerdictController
        .updateVerdict(externalPoliceDocumentId, verdict, theCase, dto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('verdict updated', () => {
    const updatedVerdict = { ...verdict, ...dto }

    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedVerdict)

      then = await givenWhenThen()
    })

    it('should update the verdict ', () => {
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId1,
        verdictId,
        dto,
        { transaction: undefined },
      )
      expect(then.result).toBe(updatedVerdict)
    })
  })
})

import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { createTestingFileModule } from '../createTestingFileModule'

import { Case } from '../../../repository'
import { UpdatePoliceDigitalCaseFilesDto } from '../../dto/updatePoliceDigitalCaseFiles.dto'
import { PoliceDigitalCaseFileService } from '../../policeDigitalCaseFiles/policeDigitalCaseFile.service'

interface Then {
  result: object
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  updateDto: UpdatePoliceDigitalCaseFilesDto,
) => Promise<Then>

describe('FileController - Update police digital case files', () => {
  let mockSequelize: Sequelize
  let mockPoliceDigitalCaseFileService: PoliceDigitalCaseFileService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, policeDigitalCaseFileService, fileController } =
      await createTestingFileModule()

    mockSequelize = sequelize
    mockPoliceDigitalCaseFileService = policeDigitalCaseFileService

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      updateDto: UpdatePoliceDigitalCaseFilesDto,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .updatePoliceDigitalCaseFiles(caseId, theCase, updateDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('orders updated', () => {
    const caseId = uuid()
    const theCase = { id: uuid() } as Case
    const transaction = {}
    const updateDto = {
      files: [{ id: uuid(), orderWithinChapter: 2 }],
    } as UpdatePoliceDigitalCaseFilesDto
    let then: Then

    beforeEach(async () => {
      const mockTransaction = mockSequelize.transaction as jest.Mock
      mockTransaction.mockImplementationOnce((fn) => fn(transaction))

      then = await givenWhenThen(caseId, theCase, updateDto)
    })

    it('should update the resolved case, not the one in the url', () => {
      expect(
        mockPoliceDigitalCaseFileService.updatePoliceDigitalCaseFileOrders,
      ).toHaveBeenCalledWith(theCase.id, updateDto.files, transaction)
      expect(then.result).toEqual({})
    })
  })
})

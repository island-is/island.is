import { Op } from 'sequelize'
import { uuid } from 'uuidv4'

import { CaseFileState } from '@island.is/judicial-system/types'

import { Case } from '../../case'
import { CaseFile } from '../models'
import { createTestingFileModule } from './createTestingFileModule'

interface Then {
  result: CaseFile[]
  error: Error
}

type GivenWhenThen = (theCase: Case) => Promise<Then>

describe('FileController - Get all case files', () => {
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { fileModel, fileController } = await createTestingFileModule()

    mockFileModel = fileModel

    givenWhenThen = async (theCase: Case): Promise<Then> => {
      const then = {} as Then

      await fileController
        .getAllCaseFiles(theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let mockFindAll: jest.Mock

    beforeEach(async () => {
      mockFindAll = mockFileModel.findAll as jest.Mock

      await givenWhenThen(theCase)
    })

    it('should request all case files from the database', () => {
      expect(mockFindAll).toHaveBeenCalledWith({
        where: {
          caseId,
          state: { [Op.not]: CaseFileState.DELETED },
        },
        order: [['created', 'DESC']],
      })
    })
  })

  describe('case files queried', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const caseFiles = [{ id: uuid() }, { id: uuid() }] as CaseFile[]
    let then: Then

    beforeEach(async () => {
      const mockFindAll = mockFileModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce(caseFiles)

      then = await givenWhenThen(theCase)
    })

    it('should return all case files', () => {
      expect(then.result).toBe(caseFiles)
    })
  })

  describe('database query fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindAll = mockFileModel.findAll as jest.Mock
      mockFindAll.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

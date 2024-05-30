import { uuid } from 'uuidv4'

import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { Case } from '../../../case'
import { DeliverResponse } from '../../models/deliver.response'
import { CaseFile } from '../../models/file.model'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  fileId: string,
  caseFile: CaseFile,
) => Promise<Then>

describe('InternalFileController - Archive case files', () => {
  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, internalFileController } =
      await createTestingFileModule()

    mockAwsS3Service = awsS3Service

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      fileId: string,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await internalFileController
        .archiveCaseFile(caseId, theCase, fileId, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case file delivered', () => {
    const caseId = uuid()
    const caseType = CaseType.INDICTMENT
    const caseState = CaseState.COMPLETED
    const fileId = uuid()
    const surrogateKey = uuid()
    const key = `${caseId}/${surrogateKey}/test.txt`
    const newKey = `indictments/completed/${caseId}/${surrogateKey}/test.txt`
    const fileName = 'test.txt'
    const fileType = 'text/plain'
    const theCase = { id: caseId, type: caseType, state: caseState } as Case
    const caseFile = {
      id: fileId,
      caseId,
      key,
      name: fileName,
      type: fileType,
    } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockArchiveObject = mockAwsS3Service.archiveObject as jest.Mock
      mockArchiveObject.mockResolvedValueOnce(newKey)

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should archive the case file', () => {
      expect(mockAwsS3Service.archiveObject).toHaveBeenCalledWith(
        caseType,
        caseState,
        key,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})

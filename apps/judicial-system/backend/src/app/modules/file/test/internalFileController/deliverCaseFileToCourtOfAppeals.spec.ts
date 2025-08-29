import { uuid } from 'uuidv4'

import { type ConfigType } from '@island.is/nest/config'

import {
  CaseFileCategory,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { nowFactory } from '../../../../factories'
import { AwsS3Service } from '../../../aws-s3'
import { CourtService } from '../../../court'
import { Case, CaseFile } from '../../../repository'
import { fileModuleConfig } from '../../file.config'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalFileController - Deliver case file to court of appeals', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const appealCaseNumber = uuid()
  const caseFileId = uuid()
  const key = uuid()
  const category: CaseFileCategory =
    CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT
  const name = uuid()
  const created = nowFactory()
  const url = uuid()
  const caseFile = {
    id: caseFileId,
    caseId,
    created,
    category,
    name,
    key,
  } as CaseFile
  const theCase = {
    id: caseId,
    type: CaseType.CUSTODY,
    appealCaseNumber,
    caseFiles: [caseFile],
  } as Case

  let mockAwsS3Service: AwsS3Service
  let mockCourtService: CourtService
  let mockFileConfig: ConfigType<typeof fileModuleConfig>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, courtService, fileConfig, internalFileController } =
      await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockCourtService = courtService
    mockFileConfig = fileConfig

    const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
    mockObjectExists.mockResolvedValueOnce(true)
    const mockGetSignedUrl = mockAwsS3Service.getSignedUrl as jest.Mock
    mockGetSignedUrl.mockResolvedValue(url)
    const mockUpdateAppealCaseWithFile =
      mockCourtService.updateAppealCaseWithFile as jest.Mock
    mockUpdateAppealCaseWithFile.mockResolvedValue(uuid())

    givenWhenThen = async () => {
      const then = {} as Then

      await internalFileController
        .deliverCaseFileToCourtOfAppeals(
          caseId,
          caseFileId,
          theCase,
          caseFile,
          { user },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case file delivered', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should return success', () => {
      expect(mockAwsS3Service.objectExists).toHaveBeenCalledWith(
        theCase.type,
        key,
      )
      expect(mockAwsS3Service.getSignedUrl).toHaveBeenCalledWith(
        theCase.type,
        key,
        mockFileConfig.robotS3TimeToLiveGet,
        true,
      )
      expect(mockCourtService.updateAppealCaseWithFile).toHaveBeenCalledWith(
        user,
        caseId,
        caseFileId,
        appealCaseNumber,
        category,
        name,
        url,
        created,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})

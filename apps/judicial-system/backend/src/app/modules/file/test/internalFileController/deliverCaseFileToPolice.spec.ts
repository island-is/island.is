import each from 'jest-each'
import { Base64 } from 'js-base64'
import { v4 as uuid } from 'uuid'

import {
  CaseFileCategory,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { InternalCaseService } from '../../../case'
import { PoliceDocumentType } from '../../../police'
import { Case, CaseFile } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  fileId: string,
  theCase: Case,
  caseFile: CaseFile,
) => Promise<Then>

describe('InternalFileController - Deliver case file to police', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockAwsS3Service: AwsS3Service
  let mockInternalCaseService: InternalCaseService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, fileService, internalFileController } =
      await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockInternalCaseService = (
      fileService as unknown as { internalCaseService: InternalCaseService }
    ).internalCaseService

    const mockDeliver =
      mockInternalCaseService.deliverCaseToPoliceWithFiles as jest.Mock
    mockDeliver.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      caseId: string,
      fileId: string,
      theCase: Case,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await internalFileController
        .deliverCaseFileToPolice(caseId, fileId, theCase, caseFile, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  each`
    category                                     | policeDocumentType
    ${CaseFileCategory.COURT_RECORD}             | ${PoliceDocumentType.RVTB}
    ${CaseFileCategory.DEFENDANT_CASE_FILE}      | ${PoliceDocumentType.RVMV}
    ${CaseFileCategory.PROSECUTOR_CASE_FILE}     | ${PoliceDocumentType.RVVS}
    ${CaseFileCategory.COURT_INDICTMENT_RULING_ORDER} | ${PoliceDocumentType.RVMG}
  `.describe(
    '$category delivered as $policeDocumentType',
    ({ category, policeDocumentType }) => {
      const caseId = uuid()
      const theCase = {
        id: caseId,
        type: CaseType.INDICTMENT,
        state: CaseState.COMPLETED,
      } as Case
      const fileId = uuid()
      const caseFile = {
        id: fileId,
        key: `${caseId}/${uuid()}/test.pdf`,
        isKeyAccessible: true,
        category,
        hash: uuid(),
      } as CaseFile
      const content = Buffer.from('Test content')

      let then: Then

      beforeEach(async () => {
        const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
        mockObjectExists.mockResolvedValueOnce(true)
        const mockGetObject = mockAwsS3Service.getObject as jest.Mock
        mockGetObject.mockResolvedValueOnce(content)
        const mockGetConfirmedObject =
          mockAwsS3Service.getConfirmedIndictmentCaseObject as jest.Mock
        mockGetConfirmedObject.mockResolvedValueOnce(content)
        const mockDeliver =
          mockInternalCaseService.deliverCaseToPoliceWithFiles as jest.Mock
        mockDeliver.mockResolvedValueOnce(true)

        then = await givenWhenThen(caseId, fileId, theCase, caseFile)
      })

      it('should deliver the case file to police', () => {
        expect(
          mockInternalCaseService.deliverCaseToPoliceWithFiles,
        ).toHaveBeenCalledWith(theCase, user, [
          {
            type: policeDocumentType,
            courtDocument: Base64.btoa(content.toString('binary')),
          },
        ])
        expect(then.result.delivered).toEqual(true)
      })
    },
  )

  describe('case file not accessible', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
    } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      key: `${caseId}/${uuid()}/test.pdf`,
      isKeyAccessible: false,
      category: CaseFileCategory.COURT_RECORD,
    } as CaseFile

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
    })

    it('should not deliver the case file', () => {
      expect(
        mockInternalCaseService.deliverCaseToPoliceWithFiles,
      ).not.toHaveBeenCalled()
      expect(then.result.delivered).toEqual(false)
    })
  })
})

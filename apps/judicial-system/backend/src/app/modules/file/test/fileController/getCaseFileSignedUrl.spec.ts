import { PDFDocument } from 'pdf-lib'
import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { NotFoundException } from '@nestjs/common'

import {
  AppealCaseState,
  CaseFileCategory,
  CaseType,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { Case, CaseFile, CaseFileRepositoryService } from '../../../repository'
import { FileService } from '../../file.service'
import { SignedUrl } from '../../models/signedUrl.model'

interface Then {
  result: SignedUrl
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  fileId: string,
  caseFile: CaseFile,
) => Promise<Then>

describe('FileController - Get case file signed url', () => {
  let mockAwsS3Service: AwsS3Service
  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let fileService: FileService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      awsS3Service,
      caseFileRepositoryService,
      fileService: service,
      fileController,
    } = await createTestingFileModule()

    fileService = service

    mockAwsS3Service = awsS3Service
    mockCaseFileRepositoryService = caseFileRepositoryService

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      fileId: string,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .getCaseFileSignedUrl(caseId, theCase, fileId, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('signed url created', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    const theCase = {
      id: uuid(),
      type: CaseType.ADMISSION_TO_FACILITY,
    } as Case
    const url = `uploads/${key}`
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetSignedUrl = mockAwsS3Service.getSignedUrl as jest.Mock
      mockGetSignedUrl.mockResolvedValueOnce(url)

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should create a signed url', () => {
      expect(mockAwsS3Service.objectExists).toHaveBeenCalledWith(
        theCase.type,
        key,
      )
      expect(mockAwsS3Service.getSignedUrl).toHaveBeenCalledWith(
        theCase.type,
        key,
        undefined,
        false,
      )
      expect(then.result).toEqual({ url })
    })
  })

  describe('verdict appeal ruling', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/domur.pdf`
    const caseFile = {
      id: fileId,
      key,
      isKeyAccessible: true,
      category: CaseFileCategory.VERDICT_APPEAL_RULING,
    } as CaseFile
    const url = `uploads/${key}`

    beforeEach(() => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
    })

    it('is served as uploaded while the appeal is in progress', async () => {
      const theCase = {
        id: caseId,
        type: CaseType.INDICTMENT,
        verdictAppealCase: { appealState: AppealCaseState.APPEALED },
      } as Case
      const mockGetSignedUrl = mockAwsS3Service.getSignedUrl as jest.Mock
      mockGetSignedUrl.mockResolvedValueOnce(url)

      const then = await givenWhenThen(caseId, theCase, fileId, caseFile)

      expect(then.result).toEqual({ url })
      expect(
        mockAwsS3Service.getConfirmedIndictmentCaseSignedUrl,
      ).not.toHaveBeenCalled()
    })

    describe('once the appeal is completed', () => {
      const theCase = {
        id: caseId,
        type: CaseType.INDICTMENT,
        verdictAppealCase: {
          appealState: AppealCaseState.COMPLETED,
          appealRulingDate: new Date('2026-11-20T10:00:00Z'),
        },
      } as Case
      let then: Then
      let confirm: (content: Buffer) => Promise<string | undefined>

      beforeEach(async () => {
        const mockGetConfirmedSignedUrl =
          mockAwsS3Service.getConfirmedIndictmentCaseSignedUrl as jest.Mock
        mockGetConfirmedSignedUrl.mockImplementationOnce(
          (_type, _key, _force, confirmContent) => {
            confirm = confirmContent

            return Promise.resolve(url)
          },
        )

        then = await givenWhenThen(caseId, theCase, fileId, caseFile)
      })

      it('is served confirmed', () => {
        expect(then.result).toEqual({ url })
        expect(
          mockAwsS3Service.getConfirmedIndictmentCaseSignedUrl,
        ).toHaveBeenCalledWith(
          CaseType.INDICTMENT,
          key,
          true,
          expect.any(Function),
          undefined,
          false,
        )
        expect(mockAwsS3Service.getSignedUrl).not.toHaveBeenCalled()
      })

      it('is stamped and its hash stored', async () => {
        const pdfDocument = await PDFDocument.create()
        pdfDocument.addPage()
        const pdf = Buffer.from(await pdfDocument.save())

        const confirmed = await confirm(pdf)

        expect(confirmed).toBeDefined()
        expect(mockCaseFileRepositoryService.updateById).toHaveBeenCalledWith(
          fileId,
          { hash: expect.any(String), hashAlgorithm: expect.any(String) },
        )
      })

      it('is still stamped when its hash cannot be stored', async () => {
        const mockUpdateById =
          mockCaseFileRepositoryService.updateById as jest.Mock
        mockUpdateById.mockRejectedValueOnce(new Error('Some error'))
        const pdfDocument = await PDFDocument.create()
        pdfDocument.addPage()
        const pdf = Buffer.from(await pdfDocument.save())

        const confirmed = await confirm(pdf)

        expect(confirmed).toBeDefined()
      })
    })

    it('is served from the stamped copy while its hash is stored', async () => {
      const theCase = {
        id: caseId,
        type: CaseType.INDICTMENT,
        verdictAppealCase: {
          appealState: AppealCaseState.COMPLETED,
          appealRulingDate: new Date('2026-11-20T10:00:00Z'),
        },
      } as Case
      const mockGetConfirmedSignedUrl =
        mockAwsS3Service.getConfirmedIndictmentCaseSignedUrl as jest.Mock
      mockGetConfirmedSignedUrl.mockResolvedValueOnce(url)

      await givenWhenThen(caseId, theCase, fileId, {
        ...caseFile,
        hash: 'stored-hash',
      } as CaseFile)

      expect(
        mockAwsS3Service.getConfirmedIndictmentCaseSignedUrl,
      ).toHaveBeenCalledWith(
        CaseType.INDICTMENT,
        key,
        false,
        expect.any(Function),
        undefined,
        false,
      )
    })

    // When the date it is stamped with changes, the ruling's hash is cleared,
    // and the next read stamps the document again instead of serving the
    // stamped copy that carries the old date.
    it('is stamped again once the date it is stamped with changes', async () => {
      const theCase = {
        id: caseId,
        type: CaseType.INDICTMENT,
        verdictAppealCase: {
          appealState: AppealCaseState.COMPLETED,
          appealRulingDate: new Date('2026-11-21T10:00:00Z'),
        },
      } as Case
      const transaction = {} as Transaction
      const mockGetConfirmedSignedUrl =
        mockAwsS3Service.getConfirmedIndictmentCaseSignedUrl as jest.Mock
      mockGetConfirmedSignedUrl.mockResolvedValueOnce(url)

      await fileService.invalidateVerdictAppealRulingConfirmation(
        caseId,
        transaction,
      )
      // The file as the clearing leaves it.
      const then = await givenWhenThen(caseId, theCase, fileId, {
        ...caseFile,
        hash: null,
        hashAlgorithm: null,
      } as unknown as CaseFile)

      expect(
        mockCaseFileRepositoryService.clearHashesForCaseAndCategory,
      ).toHaveBeenCalledWith(caseId, CaseFileCategory.VERDICT_APPEAL_RULING, {
        transaction,
      })
      expect(then.result).toEqual({ url })
      expect(
        mockAwsS3Service.getConfirmedIndictmentCaseSignedUrl,
      ).toHaveBeenCalledWith(
        CaseType.INDICTMENT,
        key,
        true,
        expect.any(Function),
        undefined,
        false,
      )
    })
  })

  describe('file not found in AWS S3', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
    } as Case
    let mockUpdate: jest.Mock
    let then: Then

    beforeEach(async () => {
      mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(false)

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should set isKeyAccessible to false and throw', () => {
      expect(mockUpdate).toHaveBeenCalledWith(fileId, {
        isKeyAccessible: false,
      })
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`File ${fileId} does not exist in AWS S3`)
    })
  })

  describe('ruling order pronounced orally has no document', () => {
    const caseId = uuid()
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      isPronouncedOrally: true,
      key: '',
      isKeyAccessible: true,
    } as CaseFile
    const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
    let mockUpdate: jest.Mock
    let then: Then

    beforeEach(async () => {
      mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should throw without looking the object up or marking the file inaccessible', () => {
      expect(mockAwsS3Service.objectExists).not.toHaveBeenCalled()
      expect(mockUpdate).not.toHaveBeenCalled()
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `File ${fileId} has no document - the ruling order was pronounced orally and has not been written up`,
      )
    })
  })

  describe('ruling order pronounced orally has been written up', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/ruling.pdf`
    const caseFile = {
      id: fileId,
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      isPronouncedOrally: true,
      key,
      isKeyAccessible: true,
    } as CaseFile
    const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
    const url = `uploads/${key}`
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetSignedUrl = mockAwsS3Service.getSignedUrl as jest.Mock
      mockGetSignedUrl.mockResolvedValueOnce(url)

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should create a signed url', () => {
      expect(then.result).toEqual({ url })
    })
  })

  describe('signed url creation fails', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    const theCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetSignedUrl = mockAwsS3Service.getSignedUrl as jest.Mock
      mockGetSignedUrl.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

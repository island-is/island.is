import { v4 as uuid } from 'uuid'

import { PayloadTooLargeException } from '@nestjs/common'

import { EmailService } from '@island.is/email-service'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import { User } from '@island.is/judicial-system/types'

import { createTestingCourtModule } from './createTestingCourtModule'

import { randomEnum } from '../../../test'
import { CourtDocumentFolder } from '../court.service'

interface Then {
  result: string
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  courtId: string | undefined,
  courtCaseNumber: string | undefined,
  caseFolder: CourtDocumentFolder,
  subject: string,
  fileName: string,
  fileType: string,
  content: Buffer,
) => Promise<Then>

describe('CourtService - Create document', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const courtId = uuid()
  const courtCaseNumber = uuid()
  const caseFolder = randomEnum(CourtDocumentFolder)
  const subject = 'subject'
  const fileName = 'fileName'
  const fileType = 'fileType'
  const content = Buffer.from('content')
  const streamId = uuid()
  const documentId = uuid()
  const courtEmail = 'court@omnitrix.is'
  let mockCourtClientService: CourtClientService
  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_EMAILS = `{"${courtId}": "${courtEmail}"}`

    const { courtClientService, emailService, courtService } =
      await createTestingCourtModule()

    mockEmailService = emailService
    mockCourtClientService = courtClientService
    const mockUploadStream = mockCourtClientService.uploadStream as jest.Mock
    mockUploadStream.mockResolvedValue(streamId)
    const mockCreateDocument =
      mockCourtClientService.createDocument as jest.Mock
    mockCreateDocument.mockResolvedValue(documentId)

    givenWhenThen = async (
      caseId: string,
      courtId: string | undefined,
      courtCaseNumber: string | undefined,
      caseFolder: CourtDocumentFolder,
      subject: string,
      fileName: string,
      fileType: string,
      content: Buffer,
    ) => {
      const then = {} as Then

      try {
        then.result = await courtService.createDocument(
          user,
          caseId,
          courtId,
          courtCaseNumber,
          caseFolder,
          subject,
          fileName,
          fileType,
          content,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('document created', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        caseId,
        courtId,
        courtCaseNumber,
        caseFolder,
        subject,
        fileName,
        fileType,
        content,
      )
    })

    it('should upload a stream', () => {
      expect(mockCourtClientService.uploadStream).toHaveBeenCalledWith(
        courtId,
        {
          value: content,
          options: { filename: fileName, contentType: fileType },
        },
      )
    })

    it('should create a document', () => {
      expect(mockCourtClientService.createDocument).toHaveBeenCalledWith(
        courtId,
        {
          caseNumber: courtCaseNumber,
          subject,
          fileName,
          streamID: streamId,
          caseFolder,
        },
      )
    })

    it('should return the document id', () => {
      expect(then.result).toBe(documentId)
    })
  })

  describe('stream upload fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockUploadStream = mockCourtClientService.uploadStream as jest.Mock
      mockUploadStream.mockRejectedValueOnce(new Error('Upload stream failed'))

      then = await givenWhenThen(
        caseId,
        courtId,
        courtCaseNumber,
        caseFolder,
        subject,
        fileName,
        fileType,
        content,
      )
    })

    it('should throw an error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Upload stream failed')
    })
  })

  describe('document creation fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreateDocument =
        mockCourtClientService.createDocument as jest.Mock
      mockCreateDocument.mockRejectedValueOnce(
        new Error('Create document failed'),
      )

      then = await givenWhenThen(
        caseId,
        courtId,
        courtCaseNumber,
        caseFolder,
        subject,
        fileName,
        fileType,
        content,
      )
    })

    it('should throw an error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Create document failed')
    })
  })

  describe('file is too large for the court service', () => {
    const largeFileName = 'testFile.pdf'
    let then: Then

    beforeEach(async () => {
      const mockUploadStream = mockCourtClientService.uploadStream as jest.Mock
      mockUploadStream.mockRejectedValueOnce(new PayloadTooLargeException())

      then = await givenWhenThen(
        caseId,
        courtId,
        courtCaseNumber,
        caseFolder,
        subject,
        largeFileName,
        fileType,
        content,
      )
    })

    it('should notify the court with a masked file name', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: '', address: courtEmail }],
          subject: `Ekki tókst að hlaða upp skjali í Auði í máli ${courtCaseNumber}`,
          text: 'Ekki tókst að hlaða upp skjali t******e.pdf í Auði vegna stærðartakmarkana. Vinsamlegast hlaðið skjali upp handvirkt.',
        }),
      )
    })

    it('should throw a payload too large exception', () => {
      expect(then.error).toBeInstanceOf(PayloadTooLargeException)
    })
  })

  describe('file is too large for a court without a registered email address', () => {
    let then: Then

    beforeEach(async () => {
      const mockUploadStream = mockCourtClientService.uploadStream as jest.Mock
      mockUploadStream.mockRejectedValueOnce(new PayloadTooLargeException())

      then = await givenWhenThen(
        caseId,
        uuid(),
        courtCaseNumber,
        caseFolder,
        subject,
        fileName,
        fileType,
        content,
      )
    })

    it('should not send an email', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
    })

    it('should throw a payload too large exception', () => {
      expect(then.error).toBeInstanceOf(PayloadTooLargeException)
    })
  })
})

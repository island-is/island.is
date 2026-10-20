import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { CaseState, CaseType, EventType } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import {
  createConfirmedIndictmentPdf,
  getCaseFileHash,
} from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { Case, CaseRepositoryService, EventLog } from '../../../repository'
import { PdfService } from '../../pdf.service'

jest.mock('../../../../formatters/confirmation/confirmedPdf')

describe('PdfService - replaceIndictmentPdf', () => {
  const caseId = uuid()
  const splitCaseId = uuid()
  const key = `${caseId}/${uuid()}/Ákæra.pdf`
  const confirmedAt = new Date('2026-10-20T10:00:00Z')
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.SUBMITTED,
    eventLogs: [
      {
        eventType: EventType.INDICTMENT_CONFIRMED,
        userName: 'Ása Saksóknari',
        userTitle: 'saksóknari',
        institutionName: 'Lögreglustjórinn á höfuðborgarsvæðinu',
        created: confirmedAt,
      },
    ] as EventLog[],
    splitCases: [{ id: splitCaseId }],
  } as Case
  const uploaded = Buffer.from('%PDF-uploaded')
  const stamped = Buffer.from('%PDF-stamped')
  const transaction = {} as Transaction

  let pdfService: PdfService
  let awsS3Service: AwsS3Service
  let caseRepositoryService: CaseRepositoryService

  beforeEach(async () => {
    jest.clearAllMocks()
    const testingModule = await createTestingCaseModule()
    pdfService = testingModule.pdfService
    awsS3Service = testingModule.awsS3Service
    caseRepositoryService = testingModule.caseRepositoryService
    ;(awsS3Service.getObject as jest.Mock).mockResolvedValue(uploaded)
    ;(awsS3Service.putObject as jest.Mock).mockResolvedValue(undefined)
    ;(awsS3Service.deleteObject as jest.Mock).mockResolvedValue(true)
    ;(createConfirmedIndictmentPdf as jest.Mock).mockResolvedValue(stamped)
  })

  it('stamps the upload and stores it as the indictment', async () => {
    await pdfService.replaceIndictmentPdf(theCase, key, transaction)

    expect(awsS3Service.getObject).toHaveBeenCalledWith(
      CaseType.INDICTMENT,
      key,
    )
    expect(createConfirmedIndictmentPdf).toHaveBeenCalledWith(
      {
        actor: 'Ása Saksóknari',
        title: 'saksóknari',
        institution: 'Lögreglustjórinn á höfuðborgarsvæðinu',
        date: confirmedAt,
      },
      uploaded,
    )
    expect(awsS3Service.putObject).toHaveBeenCalledWith(
      CaseType.INDICTMENT,
      `${caseId}/indictment.pdf`,
      stamped.toString('binary'),
    )
  })

  it('records the hash of the stored file on the case and its split cases', async () => {
    await pdfService.replaceIndictmentPdf(theCase, key, transaction)

    const { hash, hashAlgorithm } = getCaseFileHash(stamped)
    const indictmentHash = JSON.stringify({ hash, hashAlgorithm })

    expect(caseRepositoryService.update).toHaveBeenCalledWith(
      caseId,
      { indictmentHash },
      { transaction },
    )
    expect(caseRepositoryService.update).toHaveBeenCalledWith(
      splitCaseId,
      { indictmentHash },
      { transaction },
    )
  })

  it('removes the temporary upload', async () => {
    await pdfService.replaceIndictmentPdf(theCase, key, transaction)

    expect(awsS3Service.deleteObject).toHaveBeenCalledWith(
      CaseType.INDICTMENT,
      key,
    )
  })

  it('refuses a case that has not been confirmed', async () => {
    await expect(
      pdfService.replaceIndictmentPdf(
        { ...theCase, eventLogs: [] } as unknown as Case,
        key,
        transaction,
      ),
    ).rejects.toBeInstanceOf(BadRequestException)
    expect(awsS3Service.putObject).not.toHaveBeenCalled()
  })

  it('refuses a file that cannot be stamped', async () => {
    ;(createConfirmedIndictmentPdf as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to parse PDF document'),
    )

    await expect(
      pdfService.replaceIndictmentPdf(theCase, key, transaction),
    ).rejects.toBeInstanceOf(BadRequestException)
    expect(awsS3Service.putObject).not.toHaveBeenCalled()
    expect(caseRepositoryService.update).not.toHaveBeenCalled()
  })
})

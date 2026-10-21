import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { getCaseFileHash } from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { Case, CaseRepositoryService } from '../../../repository'
import { PdfService } from '../../pdf.service'

describe('PdfService - replaceIndictmentPdf', () => {
  const caseId = uuid()
  const splitCaseId = uuid()
  const key = `${caseId}/${uuid()}/Ákæra.pdf`
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.SUBMITTED,
    splitCases: [{ id: splitCaseId }],
  } as Case
  const uploaded = Buffer.from('%PDF-uploaded')
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
  })

  it('stores the upload as the indictment', async () => {
    await pdfService.replaceIndictmentPdf(theCase, key, transaction)

    expect(awsS3Service.getObject).toHaveBeenCalledWith(
      CaseType.INDICTMENT,
      key,
    )
    expect(awsS3Service.putObject).toHaveBeenCalledWith(
      CaseType.INDICTMENT,
      `${caseId}/indictment.pdf`,
      uploaded.toString('binary'),
    )
  })

  it('records the hash of the stored file on the case and its split cases', async () => {
    await pdfService.replaceIndictmentPdf(theCase, key, transaction)

    const { hash, hashAlgorithm } = getCaseFileHash(uploaded)
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

  it('refuses using the frozen indictment key as the upload', async () => {
    await expect(
      pdfService.replaceIndictmentPdf(
        theCase,
        `${caseId}/indictment.pdf`,
        transaction,
      ),
    ).rejects.toBeInstanceOf(BadRequestException)
    expect(awsS3Service.getObject).not.toHaveBeenCalled()
    expect(awsS3Service.putObject).not.toHaveBeenCalled()
  })
})

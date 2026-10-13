import { v4 as uuid } from 'uuid'

import {
  AppealSummonsAppellantSide,
  CaseType,
  HashAlgorithm,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { createAppealSummons } from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { AppealSummons, Case } from '../../../repository'
import { PdfService } from '../../pdf.service'

jest.mock('../../../../formatters/generatedPdfs/appealSummonsPdf')

describe('PdfService - getAppealSummonsPdf', () => {
  const caseId = uuid()
  const summonsId = uuid()
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    courtCaseNumber: 'S-1/2026',
    rulingDate: new Date('2026-05-04T12:00:00.000Z'),
    defendants: [],
  } as Case
  const user = {
    id: uuid(),
    name: 'Kamilla Haraldz',
    title: 'saksóknari',
    role: UserRole.PROSECUTOR,
  }
  const pdf = Buffer.from('%PDF-appeal-summons')
  const key = `${caseId}/appealSummons/${summonsId}.pdf`

  let pdfService: PdfService
  let mockAwsS3Service: AwsS3Service

  beforeEach(async () => {
    const testingModule = await createTestingCaseModule()
    pdfService = testingModule.pdfService
    mockAwsS3Service = testingModule.awsS3Service
    ;(createAppealSummons as jest.Mock).mockResolvedValue(pdf)
    ;(mockAwsS3Service.getObject as jest.Mock).mockRejectedValue(
      new Error('not found'),
    )
    ;(mockAwsS3Service.putObject as jest.Mock).mockResolvedValue(undefined)
  })

  it('serves a confirmed summons from S3 when a hash is set', async () => {
    const cached = Buffer.from('%PDF-cached')
    ;(mockAwsS3Service.getObject as jest.Mock).mockResolvedValueOnce(cached)

    const result = await pdfService.getAppealSummonsPdf(
      theCase,
      user as never,
      {
        id: summonsId,
        confirmedDate: new Date('2026-06-05T09:15:00.000Z'),
        hash: 'frozen-hash',
        hashAlgorithm: HashAlgorithm.SHA256,
        confirmedBy: user,
        defendants: [],
      } as AppealSummons,
    )

    expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(
      CaseType.INDICTMENT,
      key,
    )
    expect(createAppealSummons).not.toHaveBeenCalled()
    expect(result).toBe(cached)
  })

  it('uploads a confirmed summons PDF to S3 after generating it', async () => {
    const confirmed = {
      id: summonsId,
      confirmedDate: new Date('2026-06-05T09:15:00.000Z'),
      confirmedBy: user,
      defendants: [],
    } as AppealSummons

    const result = await pdfService.getAppealSummonsPdf(
      theCase,
      user as never,
      confirmed,
    )

    expect(createAppealSummons).toHaveBeenCalled()
    expect(mockAwsS3Service.putObject).toHaveBeenCalledWith(
      CaseType.INDICTMENT,
      key,
      pdf.toString('binary'),
    )
    expect(result).toBe(pdf)
  })

  it('fails when a hashed summons has no S3 object instead of regenerating', async () => {
    ;(createAppealSummons as jest.Mock).mockClear()
    ;(mockAwsS3Service.putObject as jest.Mock).mockClear()

    await expect(
      pdfService.getAppealSummonsPdf(theCase, user as never, {
        id: summonsId,
        confirmedDate: new Date('2026-06-05T09:15:00.000Z'),
        hash: 'frozen-hash',
        hashAlgorithm: HashAlgorithm.SHA256,
        confirmedBy: user,
        defendants: [],
      } as AppealSummons),
    ).rejects.toThrow(
      `Appeal summons ${summonsId} has a hash but its PDF was not found in S3`,
    )

    expect(createAppealSummons).not.toHaveBeenCalled()
    expect(mockAwsS3Service.putObject).not.toHaveBeenCalled()
  })

  it('propagates an S3 upload failure for a confirmed summons', async () => {
    ;(mockAwsS3Service.putObject as jest.Mock).mockRejectedValueOnce(
      new Error('upload failed'),
    )

    await expect(
      pdfService.getAppealSummonsPdf(theCase, user as never, {
        id: summonsId,
        confirmedDate: new Date('2026-06-05T09:15:00.000Z'),
        confirmedBy: user,
        defendants: [],
      } as AppealSummons),
    ).rejects.toThrow('upload failed')
  })

  it('does not touch S3 for an unconfirmed preview', async () => {
    await pdfService.getAppealSummonsPdf(theCase, user as never, undefined, [
      {
        defendantId: uuid(),
        appellantSide: AppealSummonsAppellantSide.DEFENCE,
        claims: 'Kröfur',
      },
    ])

    expect(mockAwsS3Service.getObject).not.toHaveBeenCalled()
    expect(mockAwsS3Service.putObject).not.toHaveBeenCalled()
  })
})

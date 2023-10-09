import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { FormatMessage, IntlService } from '@island.is/cms-translations'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseFileCategory,
  CaseState,
  completedCaseStates,
  type User as TUser,
} from '@island.is/judicial-system/types'

import {
  createCaseFilesRecord,
  createIndictment,
  getCourtRecordPdfAsBuffer,
  getCustodyNoticePdfAsBuffer,
  getRequestPdfAsBuffer,
  getRulingPdfAsBuffer,
} from '../../formatters'
import { AwsS3Service } from '../aws-s3'
import { Case } from './models/case.model'

@Injectable()
export class PDFService {
  private throttle = Promise.resolve(Buffer.from(''))

  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly intlService: IntlService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private formatMessage: FormatMessage = () => {
    throw new InternalServerErrorException('Format message not initialized')
  }

  private async refreshFormatMessage(): Promise<void> {
    return this.intlService
      .useIntl(['judicial.system.backend'], 'is')
      .then((res) => {
        this.formatMessage = res.formatMessage
      })
      .catch((reason) => {
        this.logger.error('Unable to refresh format messages', { reason })
      })
  }

  private async throttleGetCaseFilesRecordPdf(
    theCase: Case,
    policeCaseNumber: string,
  ): Promise<Buffer> {
    // Serialize all case files pdf generations in this process
    await this.throttle.catch((reason) => {
      this.logger.info('Previous case files pdf generation failed', { reason })
    })

    await this.refreshFormatMessage()

    const caseFiles = theCase.caseFiles
      ?.filter(
        (caseFile) =>
          caseFile.policeCaseNumber === policeCaseNumber &&
          caseFile.category === CaseFileCategory.CASE_FILE &&
          caseFile.type === 'application/pdf' &&
          caseFile.key &&
          caseFile.chapter !== null &&
          caseFile.orderWithinChapter !== null,
      )
      ?.sort(
        (caseFile1, caseFile2) =>
          (caseFile1.chapter ?? 0) - (caseFile2.chapter ?? 0) ||
          (caseFile1.orderWithinChapter ?? 0) -
            (caseFile2.orderWithinChapter ?? 0),
      )
      ?.map((caseFile) => async () => {
        const buffer = await this.awsS3Service
          .getObject(caseFile.key ?? '')
          .catch((reason) => {
            // Tolerate failure, but log error
            this.logger.error(
              `Unable to get file ${caseFile.id} of case ${theCase.id} from AWS S3`,
              { reason },
            )
          })

        return {
          chapter: caseFile.chapter as number,
          date: caseFile.displayDate ?? caseFile.created,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          buffer: buffer ?? undefined,
        }
      })

    return createCaseFilesRecord(
      theCase,
      policeCaseNumber,
      caseFiles ?? [],
      this.formatMessage,
    )
  }

  async getCourtRecordPdf(theCase: Case, user: TUser): Promise<Buffer> {
    if (theCase.courtRecordSignatureDate) {
      try {
        return await this.awsS3Service.getObject(
          `generated/${theCase.id}/courtRecord.pdf`,
        )
      } catch (error) {
        this.logger.info(
          `The court record for case ${theCase.id} was not found in AWS S3`,
          { error },
        )
      }
    }

    await this.refreshFormatMessage()

    return getCourtRecordPdfAsBuffer(theCase, this.formatMessage, user)
  }

  async getRequestPdf(theCase: Case): Promise<Buffer> {
    await this.refreshFormatMessage()

    return getRequestPdfAsBuffer(theCase, this.formatMessage)
  }

  async getRulingPdf(theCase: Case): Promise<Buffer> {
    if (theCase.rulingSignatureDate) {
      try {
        return await this.awsS3Service.getObject(
          `generated/${theCase.id}/ruling.pdf`,
        )
      } catch (error) {
        this.logger.info(
          `The ruling for case ${theCase.id} was not found in AWS S3`,
          { error },
        )
      }
    }

    await this.refreshFormatMessage()

    return getRulingPdfAsBuffer(theCase, this.formatMessage)
  }

  async getCustodyPdf(theCase: Case): Promise<Buffer> {
    await this.refreshFormatMessage()

    return getCustodyNoticePdfAsBuffer(theCase, this.formatMessage)
  }

  async getIndictmentPdf(theCase: Case): Promise<Buffer> {
    await this.refreshFormatMessage()

    return createIndictment(theCase, this.formatMessage)
  }

  async getCaseFilesRecordPdf(
    theCase: Case,
    policeCaseNumber: string,
  ): Promise<Buffer> {
    if (
      ![CaseState.NEW, CaseState.DRAFT, CaseState.SUBMITTED].includes(
        theCase.state,
      )
    ) {
      if (completedCaseStates.includes(theCase.state)) {
        try {
          return await this.awsS3Service.getObject(
            `indictments/completed/${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
          )
        } catch {
          // Ignore the error and try the original key
        }
      }

      try {
        return await this.awsS3Service.getObject(
          `indictments/${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
        )
      } catch {
        // Ignore the error and generate the pdf
      }
    }

    this.throttle = this.throttleGetCaseFilesRecordPdf(
      theCase,
      policeCaseNumber,
    )

    return this.throttle
  }
}

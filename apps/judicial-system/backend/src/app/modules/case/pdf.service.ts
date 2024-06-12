import CryptoJS from 'crypto-js'

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { FormatMessage, IntlService } from '@island.is/cms-translations'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseFileCategory,
  EventType,
  hasIndictmentCaseBeenSubmittedToCourt,
  isTrafficViolationCase,
  SubpoenaType,
  type User as TUser,
} from '@island.is/judicial-system/types'

import {
  createCaseFilesRecord,
  createIndictment,
  getCourtRecordPdfAsBuffer,
  getCustodyNoticePdfAsBuffer,
  getRequestPdfAsBuffer,
  getRulingPdfAsBuffer,
  IndictmentConfirmation,
} from '../../formatters'
import { createSubpoenaPDF } from '../../formatters/subpoenaPdf'
import { AwsS3Service } from '../aws-s3'
import { UserService } from '../user'
import { Case } from './models/case.model'

@Injectable()
export class PDFService {
  private throttle = Promise.resolve(Buffer.from(''))

  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly intlService: IntlService,
    private readonly userService: UserService,
    @InjectModel(Case) private readonly caseModel: typeof Case,
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
          .getObject(theCase.type, theCase.state, caseFile.key)
          .catch((reason) => {
            // Tolerate failure, but log error
            this.logger.error(
              `Unable to get file ${caseFile.id} of case ${theCase.id} from AWS S3`,
              { reason },
            )

            return undefined
          })

        return {
          chapter: caseFile.chapter as number,
          date: caseFile.displayDate ?? caseFile.created,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          buffer: buffer,
        }
      })

    const generatedPdf = await createCaseFilesRecord(
      theCase,
      policeCaseNumber,
      caseFiles ?? [],
      this.formatMessage,
    )

    if (hasIndictmentCaseBeenSubmittedToCourt(theCase.state)) {
      // No need to wait for the upload to finish
      this.tryUploadPdfToS3(
        theCase,
        `${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
        generatedPdf,
      )
    }

    return generatedPdf
  }

  async getCourtRecordPdf(theCase: Case, user: TUser): Promise<Buffer> {
    if (theCase.courtRecordSignatureDate) {
      try {
        return await this.awsS3Service.getGeneratedObject(
          theCase.type,
          `${theCase.id}/courtRecord.pdf`,
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
        return await this.awsS3Service.getGeneratedObject(
          theCase.type,
          `${theCase.id}/ruling.pdf`,
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

  async getCustodyNoticePdf(theCase: Case): Promise<Buffer> {
    await this.refreshFormatMessage()

    return getCustodyNoticePdfAsBuffer(theCase, this.formatMessage)
  }

  private async tryGetPdfFromS3(
    theCase: Case,
    key: string,
  ): Promise<Buffer | undefined> {
    return await this.awsS3Service
      .getObject(theCase.type, theCase.state, key)
      .catch(() => undefined) // Ignore errors and return undefined
  }

  private tryUploadPdfToS3(theCase: Case, key: string, pdf: Buffer) {
    this.awsS3Service
      .putObject(theCase.type, theCase.state, key, pdf.toString('binary'))
      .catch((reason) => {
        this.logger.error(`Failed to upload pdf ${key} to AWS S3`, { reason })
      })
  }

  async getIndictmentPdf(theCase: Case): Promise<Buffer> {
    if (!isTrafficViolationCase(theCase)) {
      throw new BadRequestException(
        `Case ${theCase.id} is not a traffic violation case`,
      )
    }

    let confirmation: IndictmentConfirmation | undefined = undefined

    if (hasIndictmentCaseBeenSubmittedToCourt(theCase.state)) {
      if (theCase.indictmentHash) {
        const existingPdf = await this.tryGetPdfFromS3(
          theCase,
          `${theCase.id}/indictment.pdf`,
        )

        if (existingPdf) {
          return existingPdf
        }
      }

      const confirmationEvent = theCase.eventLogs?.find(
        (event) => event.eventType === EventType.INDICTMENT_CONFIRMED,
      )

      if (confirmationEvent && confirmationEvent.nationalId) {
        const actor = await this.userService.findByNationalId(
          confirmationEvent.nationalId,
        )

        confirmation = {
          actor: actor.name,
          title: actor.title,
          institution: actor.institution?.name ?? '',
          date: confirmationEvent.created,
        }
      }
    }

    await this.refreshFormatMessage()

    const generatedPdf = await createIndictment(
      theCase,
      this.formatMessage,
      confirmation,
    )

    if (hasIndictmentCaseBeenSubmittedToCourt(theCase.state) && confirmation) {
      const indictmentHash = CryptoJS.MD5(
        generatedPdf.toString('binary'),
      ).toString(CryptoJS.enc.Hex)

      // No need to wait for this to finish
      this.caseModel
        .update({ indictmentHash }, { where: { id: theCase.id } })
        .then(() =>
          this.tryUploadPdfToS3(
            theCase,
            `${theCase.id}/indictment.pdf`,
            generatedPdf,
          ),
        )
    }

    return generatedPdf
  }

  async getCaseFilesRecordPdf(
    theCase: Case,
    policeCaseNumber: string,
  ): Promise<Buffer> {
    if (hasIndictmentCaseBeenSubmittedToCourt(theCase.state)) {
      const existingPdf = await this.tryGetPdfFromS3(
        theCase,
        `${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )

      if (existingPdf) {
        return existingPdf
      }
    }

    this.throttle = this.throttleGetCaseFilesRecordPdf(
      theCase,
      policeCaseNumber,
    )

    return await this.throttle
  }
}

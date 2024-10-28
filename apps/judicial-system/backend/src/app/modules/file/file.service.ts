import CryptoJS from 'crypto-js'
import { Op, Sequelize } from 'sequelize'
import { Transaction } from 'sequelize/types'
import { uuid } from 'uuidv4'

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseFileCategory,
  CaseFileState,
  EventType,
  hasIndictmentCaseBeenSubmittedToCourt,
  isCompletedCase,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { createConfirmedPdf } from '../../formatters'
import { AwsS3Service } from '../aws-s3'
import { Case } from '../case'
import { CourtDocumentFolder, CourtService } from '../court'
import { UserService } from '../user'
import { CreateFileDto } from './dto/createFile.dto'
import { CreatePresignedPostDto } from './dto/createPresignedPost.dto'
import { UpdateFileDto } from './dto/updateFile.dto'
import { DeleteFileResponse } from './models/deleteFile.response'
import { DeliverResponse } from './models/deliver.response'
import { CaseFile } from './models/file.model'
import { PresignedPost } from './models/presignedPost.model'
import { SignedUrl } from './models/signedUrl.model'
import { UploadFileToCourtResponse } from './models/uploadFileToCourt.response'
import { fileModuleConfig } from './file.config'

// File keys have the following format:
// <uuid>/<uuid>/<filename>
// As uuid-s have length 36, the filename starts at position 82 in the key.
const NAME_BEGINS_INDEX = 74

@Injectable()
export class FileService {
  private throttle = Promise.resolve('')

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(CaseFile) private readonly fileModel: typeof CaseFile,
    private readonly userService: UserService,
    private readonly courtService: CourtService,
    private readonly awsS3Service: AwsS3Service,
    private readonly messageService: MessageService,
    @Inject(fileModuleConfig.KEY)
    private readonly config: ConfigType<typeof fileModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async deleteFileFromDatabase(
    fileId: string,
    transaction?: Transaction,
  ): Promise<boolean> {
    this.logger.debug(`Deleting file ${fileId} from the database`)

    const promisedUpdate = transaction
      ? this.fileModel.update(
          { state: CaseFileState.DELETED, key: null },
          { where: { id: fileId }, transaction },
        )
      : this.fileModel.update(
          { state: CaseFileState.DELETED, key: null },
          { where: { id: fileId } },
        )

    const [numberOfAffectedRows] = await promisedUpdate

    if (numberOfAffectedRows !== 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting case file ${fileId}`,
      )
    }

    return numberOfAffectedRows > 0
  }

  private async tryDeleteFileFromS3(
    theCase: Case,
    file: CaseFile,
  ): Promise<boolean> {
    this.logger.debug(`Attempting to delete file ${file.key} from AWS S3`)

    if (!file.key) {
      return true
    }

    if (
      isIndictmentCase(theCase.type) &&
      file.category === CaseFileCategory.INDICTMENT
    ) {
      // The file may have been confirmed
      return this.awsS3Service
        .deleteConfirmedIndictmentCaseObject(theCase.type, file.key)
        .catch((reason) => {
          // Tolerate failure, but log what happened
          this.logger.error(
            `Could not delete confirmed file ${file.id} of case ${file.caseId} from AWS S3`,
            { reason },
          )

          return false
        })
    }

    return this.awsS3Service
      .deleteObject(theCase.type, file.key)
      .catch((reason) => {
        // Tolerate failure, but log what happened
        this.logger.error(
          `Could not delete file ${file.id} of case ${file.caseId} from AWS S3`,
          { reason },
        )

        return false
      })
  }

  private getCourtDocumentFolder(file: CaseFile) {
    let courtDocumentFolder: CourtDocumentFolder

    switch (file.category) {
      case CaseFileCategory.INDICTMENT:
      case CaseFileCategory.CRIMINAL_RECORD:
      case CaseFileCategory.COST_BREAKDOWN:
        courtDocumentFolder = CourtDocumentFolder.INDICTMENT_DOCUMENTS
        break
      case CaseFileCategory.COURT_RECORD:
        courtDocumentFolder = CourtDocumentFolder.COURT_DOCUMENTS
        break
      case CaseFileCategory.RULING:
        courtDocumentFolder = CourtDocumentFolder.COURT_DOCUMENTS
        break
      case CaseFileCategory.CASE_FILE:
      case undefined:
      case null:
        courtDocumentFolder = CourtDocumentFolder.CASE_DOCUMENTS
        break
      case CaseFileCategory.PROSECUTOR_APPEAL_BRIEF:
      case CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE:
      case CaseFileCategory.DEFENDANT_APPEAL_BRIEF:
      case CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE:
      case CaseFileCategory.APPEAL_RULING:
        courtDocumentFolder = CourtDocumentFolder.APPEAL_DOCUMENTS
        break
      default:
        throw new BadRequestException(`Invalid file category ${file.category}`)
    }

    return courtDocumentFolder
  }

  private async confirmIndictmentCaseFile(
    theCase: Case,
    file: CaseFile,
    pdf: Buffer,
  ): Promise<string | undefined> {
    const confirmationEvent = theCase.eventLogs?.find(
      (event) => event.eventType === EventType.INDICTMENT_CONFIRMED,
    )

    if (!confirmationEvent || !confirmationEvent.nationalId) {
      return undefined
    }

    return this.userService
      .findByNationalId(confirmationEvent.nationalId)
      .then((user) => {
        if (file.category === CaseFileCategory.INDICTMENT) {
          return createConfirmedPdf(
            {
              actor: user.name,
              title: user.title,
              institution: user.institution?.name ?? '',
              date: confirmationEvent.created,
            },
            pdf,
            CaseFileCategory.INDICTMENT,
          )
        }

        if (
          (file.category === CaseFileCategory.RULING ||
            file.category === CaseFileCategory.COURT_RECORD) &&
          isCompletedCase(theCase.state) &&
          theCase.rulingDate
        ) {
          return createConfirmedPdf(
            {
              actor: theCase.judge?.name ?? '',
              title: theCase.judge?.title,
              institution: theCase.judge?.institution?.name ?? '',
              date: theCase.rulingDate,
            },
            pdf,
            file.category,
          )
        }
      })
      .then((confirmedPdf) => {
        if (!confirmedPdf) {
          throw new Error('Failed to create confirmed PDF')
        }

        const binaryPdf = confirmedPdf.toString('binary')
        const hash = CryptoJS.MD5(binaryPdf).toString(CryptoJS.enc.Hex)

        // No need to wait for the update to finish
        this.fileModel.update({ hash }, { where: { id: file.id } })

        return binaryPdf
      })
      .catch((reason) => {
        this.logger.error(
          `Failed to create confirmed indictment for case ${theCase.id}`,
          { reason },
        )

        return undefined
      })
  }

  private shouldGetConfirmedDocument = (file: CaseFile, theCase: Case) => {
    // Only case files in indictment cases can be confirmed
    if (!isIndictmentCase(theCase.type)) {
      return false
    }

    // Only indictments that have been submitted to court can be confirmed
    if (
      file.category === CaseFileCategory.INDICTMENT &&
      hasIndictmentCaseBeenSubmittedToCourt(theCase.state)
    ) {
      return true
    }

    // Rulings and court records are only confirmed when a case is completed
    if (
      (file.category === CaseFileCategory.RULING ||
        file.category === CaseFileCategory.COURT_RECORD) &&
      isCompletedCase(theCase.state)
    ) {
      return true
    }

    // Don't get confirmed document for any other file categories
    return false
  }

  async getCaseFileFromS3(theCase: Case, file: CaseFile): Promise<Buffer> {
    if (this.shouldGetConfirmedDocument(file, theCase)) {
      return this.awsS3Service.getConfirmedIndictmentCaseObject(
        theCase.type,
        file.key,
        !file.hash,
        (content: Buffer) =>
          this.confirmIndictmentCaseFile(theCase, file, content),
      )
    }

    return this.awsS3Service.getObject(theCase.type, file.key)
  }

  private async throttleUpload(
    file: CaseFile,
    theCase: Case,
    user: User,
  ): Promise<string> {
    // Serialise all uploads in this process
    await this.throttle.catch((reason) => {
      this.logger.info('Previous upload failed', { reason })
    })

    const content = await this.getCaseFileFromS3(theCase, file)

    const courtDocumentFolder = this.getCourtDocumentFolder(file)

    return this.courtService.createDocument(
      user,
      theCase.id,
      theCase.courtId,
      theCase.courtCaseNumber,
      courtDocumentFolder,
      file.name,
      file.name,
      file.type,
      content,
    )
  }

  async findById(fileId: string, caseId: string): Promise<CaseFile> {
    const caseFile = await this.fileModel.findOne({
      where: { id: fileId, caseId, state: { [Op.not]: CaseFileState.DELETED } },
    })

    if (!caseFile) {
      throw new NotFoundException(
        `Case file ${fileId} of case ${caseId} does not exist`,
      )
    }

    return caseFile
  }

  async createPresignedPost(
    theCase: Case,
    createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    const { fileName, type } = createPresignedPost

    const key = `${theCase.id}/${uuid()}/${fileName}`

    return this.awsS3Service
      .createPresignedPost(theCase.type, key, type)
      .then((presignedPost) => ({
        ...presignedPost,
        key,
      }))
  }

  async createCaseFile(
    theCase: Case,
    createFile: CreateFileDto,
    user: User,
  ): Promise<CaseFile> {
    const { key } = createFile

    const regExp = new RegExp(`^${theCase.id}/.{36}/(.*)$`)

    if (!regExp.test(key)) {
      throw new BadRequestException(
        `${key} is not a valid key for case ${theCase.id}`,
      )
    }

    const fileName = createFile.key.slice(NAME_BEGINS_INDEX)

    const file = await this.fileModel.create({
      ...createFile,
      state: CaseFileState.STORED_IN_RVG,
      caseId: theCase.id,
      name: fileName,
      userGeneratedFilename:
        createFile.userGeneratedFilename ?? fileName.replace(/\.pdf$/, ''),
      submittedBy: user.name,
    })

    if (
      theCase.appealCaseNumber &&
      file.category &&
      [
        CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
        CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
      ].includes(file.category)
    ) {
      await this.messageService.sendMessagesToQueue([
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: file.id,
        },
      ])
    }
    return file
  }

  private async verifyCaseFile(file: CaseFile, theCase: Case) {
    if (!file.key) {
      throw new NotFoundException(`File ${file.id} does not exist in AWS S3`)
    }

    const exists = await this.awsS3Service.objectExists(theCase.type, file.key)

    if (!exists) {
      // Fire and forget, no need to wait for the result
      this.fileModel.update({ key: null }, { where: { id: file.id } })

      throw new NotFoundException(`File ${file.id} does not exist in AWS S3`)
    }
  }

  private async getCaseFileSignedUrlFromS3(
    theCase: Case,
    file: CaseFile,
    timeToLive?: number,
  ): Promise<string> {
    if (this.shouldGetConfirmedDocument(file, theCase)) {
      return this.awsS3Service.getConfirmedIndictmentCaseSignedUrl(
        theCase.type,
        file.key,
        !file.hash,
        (content: Buffer) =>
          this.confirmIndictmentCaseFile(theCase, file, content),
        timeToLive,
      )
    }

    return this.awsS3Service.getSignedUrl(theCase.type, file.key, timeToLive)
  }

  async getCaseFileSignedUrl(
    theCase: Case,
    file: CaseFile,
  ): Promise<SignedUrl> {
    await this.verifyCaseFile(file, theCase)

    return this.getCaseFileSignedUrlFromS3(theCase, file).then((url) => ({
      url,
    }))
  }

  async deleteCaseFile(
    theCase: Case,
    file: CaseFile,
    transaction?: Transaction,
  ): Promise<DeleteFileResponse> {
    const success = await this.deleteFileFromDatabase(file.id, transaction)

    if (success) {
      // Fire and forget, no need to wait for the result
      this.tryDeleteFileFromS3(theCase, file)
    }

    return { success }
  }

  async uploadCaseFileToCourt(
    theCase: Case,
    file: CaseFile,
    user: User,
  ): Promise<UploadFileToCourtResponse> {
    if (file.state === CaseFileState.STORED_IN_COURT) {
      return { success: true }
    }

    await this.verifyCaseFile(file, theCase)

    this.throttle = this.throttleUpload(file, theCase, user)

    await this.throttle

    const [numberOfAffectedRows] = await this.fileModel.update(
      { state: CaseFileState.STORED_IN_COURT },
      { where: { id: file.id } },
    )

    if (numberOfAffectedRows !== 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating case file ${file.id}`,
      )
    }

    const success = numberOfAffectedRows > 0

    return { success }
  }

  async updateCaseFile(
    caseId: string,
    fileId: string,
    update: { [key: string]: string | null },
    transaction?: Transaction,
  ): Promise<CaseFile> {
    const promisedUpdate = transaction
      ? this.fileModel.update(update, {
          where: { id: fileId, caseId },
          returning: true,
          transaction,
        })
      : this.fileModel.update(update, {
          where: { id: fileId, caseId },
          returning: true,
        })

    const [numberOfAffectedRows, updatedCaseFiles] = await promisedUpdate

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating file ${fileId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update file ${fileId} of case ${caseId}`,
      )
    }

    return updatedCaseFiles[0]
  }

  async updateFiles(
    caseId: string,
    caseFileUpdates: UpdateFileDto[],
  ): Promise<CaseFile[]> {
    return this.sequelize.transaction((transaction) => {
      const updates = caseFileUpdates.map(async (update) => {
        const [affectedNumber, file] = await this.fileModel.update(update, {
          where: { caseId, id: update.id },
          returning: true,
          transaction,
        })
        if (affectedNumber !== 1 || !file[0]) {
          throw new InternalServerErrorException(
            `Could not update file ${update.id} of case ${caseId}`,
          )
        }
        return file[0]
      })

      return Promise.all(updates)
    })
  }

  resetCaseFileStates(caseId: string, transaction: Transaction) {
    return this.fileModel.update(
      { state: CaseFileState.STORED_IN_RVG },
      { where: { caseId, state: CaseFileState.STORED_IN_COURT }, transaction },
    )
  }

  resetIndictmentCaseFileHashes(caseId: string, transaction: Transaction) {
    return this.fileModel.update(
      { hash: null },
      { where: { caseId, category: CaseFileCategory.INDICTMENT }, transaction },
    )
  }

  async deliverCaseFileToCourtOfAppeals(
    theCase: Case,
    file: CaseFile,
    user: User,
  ): Promise<DeliverResponse> {
    await this.verifyCaseFile(file, theCase)

    const url = await this.getCaseFileSignedUrlFromS3(
      theCase,
      file,
      this.config.robotS3TimeToLiveGet,
    )

    return this.courtService
      .updateAppealCaseWithFile(
        user,
        theCase.id,
        file.id,
        theCase.appealCaseNumber,
        file.category,
        file.name,
        url,
        file.created,
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update appeal case ${theCase.id} with file`,
          { reason },
        )

        return { delivered: false }
      })
  }
}

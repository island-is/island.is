import { Base64 } from 'js-base64'
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

import {
  type Message,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  EventType,
  isCompletedCase,
  isIndictmentCase,
  type User,
} from '@island.is/judicial-system/types'

import { createConfirmedPdf, getCaseFileHash } from '../../formatters'
import { AwsS3Service } from '../aws-s3'
import { InternalCaseService } from '../case/internalCase.service'
import { Case } from '../case/models/case.model'
import { CourtDocumentFolder, CourtService } from '../court'
import { PoliceDocumentType } from '../police'
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

interface CreateFile extends CreateFileDto {
  defendantId?: string
  civilClaimantId?: string
}

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
    private readonly courtService: CourtService,
    private readonly awsS3Service: AwsS3Service,
    private readonly messageService: MessageService,
    private readonly internalCaseService: InternalCaseService,
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
      case CaseFileCategory.COURT_RECORD:
      case CaseFileCategory.RULING:
        courtDocumentFolder = CourtDocumentFolder.COURT_DOCUMENTS
        break
      case CaseFileCategory.CASE_FILE:
      case CaseFileCategory.PROSECUTOR_CASE_FILE:
      case CaseFileCategory.DEFENDANT_CASE_FILE:
      case CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE:
      case CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE:
      case CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE:
      case CaseFileCategory.CRIMINAL_RECORD:
      case CaseFileCategory.COST_BREAKDOWN:
      case CaseFileCategory.CIVIL_CLAIM:
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
    if (
      !theCase.rulingDate ||
      (file.category !== CaseFileCategory.RULING &&
        file.category !== CaseFileCategory.COURT_RECORD)
    ) {
      return undefined // This should never happen
    }

    const completedEvent = theCase.eventLogs?.find(
      (event) => event.eventType === EventType.INDICTMENT_COMPLETED,
    )

    return createConfirmedPdf(
      {
        actor: theCase.judge?.name ?? '',
        title: theCase.judge?.title,
        institution: theCase.judge?.institution?.name ?? '',
        date: completedEvent?.created || theCase.rulingDate,
      },
      pdf,
      file.category,
    )
      .then((confirmedPdf) => {
        if (!confirmedPdf) {
          throw new Error('Failed to create confirmed PDF')
        }

        const { hash, hashAlgorithm, binaryPdf } = getCaseFileHash(confirmedPdf)

        // No need to wait for the update to finish
        this.fileModel.update(
          { hash, hashAlgorithm },
          { where: { id: file.id } },
        )

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
    createFile: CreateFile,
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

    if (
      isIndictmentCase(theCase.type) &&
      file.category &&
      [
        CaseFileCategory.PROSECUTOR_CASE_FILE,
        CaseFileCategory.DEFENDANT_CASE_FILE,
      ].includes(file.category)
    ) {
      const messages: Message[] = []

      if (theCase.origin === CaseOrigin.LOKE) {
        messages.push({
          type: MessageType.DELIVERY_TO_POLICE_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: file.id,
        })
      }

      if (theCase.courtCaseNumber) {
        messages.push({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: file.id,
        })
      }

      await this.messageService.sendMessagesToQueue(messages)
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
    useFreshSession = false,
  ): Promise<string> {
    if (this.shouldGetConfirmedDocument(file, theCase)) {
      return this.awsS3Service.getConfirmedIndictmentCaseSignedUrl(
        theCase.type,
        file.key,
        !file.hash,
        (content: Buffer) =>
          this.confirmIndictmentCaseFile(theCase, file, content),
        timeToLive,
        useFreshSession,
      )
    }

    return this.awsS3Service.getSignedUrl(
      theCase.type,
      file.key,
      timeToLive,
      useFreshSession,
    )
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

    if (file.size === 0) {
      this.logger.warn(
        `Ignoring upload for empty file ${file.id} of case ${theCase.id}`,
      )

      return { success: true }
    }

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
      true,
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

  async deliverCaseFileToPolice(
    theCase: Case,
    file: CaseFile,
    user: User,
  ): Promise<DeliverResponse> {
    try {
      await this.verifyCaseFile(file, theCase)

      const content = await this.getCaseFileFromS3(theCase, file)

      const policeDocumentType =
        file.category === CaseFileCategory.DEFENDANT_CASE_FILE
          ? PoliceDocumentType.RVMV
          : file.category === CaseFileCategory.PROSECUTOR_CASE_FILE
          ? PoliceDocumentType.RVVS
          : // Should not happen, but we would rather deliver the file than throw an error
            PoliceDocumentType.RVMG

      const delivered =
        await this.internalCaseService.deliverCaseToPoliceWithFiles(
          theCase,
          user,
          [
            {
              type: policeDocumentType,
              courtDocument: Base64.btoa(content.toString('binary')),
            },
          ],
        )

      return { delivered }
    } catch (error) {
      this.logger.error(
        `Failed to deliver file ${file.id} of case ${theCase.id} to police`,
        { error },
      )

      return { delivered: false }
    }
  }
}

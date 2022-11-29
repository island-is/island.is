import { uuid } from 'uuidv4'
import { Op, Sequelize } from 'sequelize'
import { Transaction } from 'sequelize/types'

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FormatMessage, IntlService } from '@island.is/cms-translations'
import {
  CaseFileCategory,
  CaseFileState,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { courtUpload } from '../../messages'
import { AwsS3Service } from '../aws-s3'
import { CourtDocumentFolder, CourtService } from '../court'
import { Case } from '../case'
import { CreateFileDto } from './dto/createFile.dto'
import { CreatePresignedPostDto } from './dto/createPresignedPost.dto'
import { PresignedPost } from './models/presignedPost.model'
import { CaseFile } from './models/file.model'
import { DeleteFileResponse } from './models/deleteFile.response'
import { SignedUrl } from './models/signedUrl.model'
import { UploadFileToCourtResponse } from './models/uploadFileToCourt.response'
import { UpdateFileDto } from './dto/updateFile.dto'

// Files are stored in AWS S3 under a key which has the following format:
// uploads/<uuid>/<uuid>/<filename>
// As uuid-s have length 36, the filename starts at position 82 in the key.
const NAME_BEGINS_INDEX = 82

@Injectable()
export class FileService {
  private throttle = Promise.resolve('')

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(CaseFile) private readonly fileModel: typeof CaseFile,
    private readonly courtService: CourtService,
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

  private async deleteFileFromDatabase(fileId: string): Promise<boolean> {
    this.logger.debug(`Deleting file ${fileId} from the database`)

    const [numberOfAffectedRows] = await this.fileModel.update(
      { state: CaseFileState.DELETED, key: null },
      { where: { id: fileId } },
    )

    if (numberOfAffectedRows !== 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting case file ${fileId}`,
      )
    }

    return numberOfAffectedRows > 0
  }

  private tryDeleteFileFromS3(key: string) {
    this.logger.debug(`Attempting to delete file ${key} from AWS S3`)

    this.awsS3Service.deleteObject(key).catch((reason) => {
      // Tolerate failure, but log what happened
      this.logger.info(`Could not delete file ${key} from AWS S3`, { reason })
    })
  }

  private getCourtDocumentFolder(file: CaseFile) {
    let courtDocumentFolder: CourtDocumentFolder

    switch (file.category) {
      case CaseFileCategory.COVER_LETTER:
        courtDocumentFolder = CourtDocumentFolder.INDICTMENT_DOCUMENTS
        break
      case CaseFileCategory.INDICTMENT:
        courtDocumentFolder = CourtDocumentFolder.INDICTMENT_DOCUMENTS
        break
      case CaseFileCategory.CRIMINAL_RECORD:
        courtDocumentFolder = CourtDocumentFolder.INDICTMENT_DOCUMENTS
        break
      case CaseFileCategory.COST_BREAKDOWN:
        courtDocumentFolder = CourtDocumentFolder.INDICTMENT_DOCUMENTS
        break
      case CaseFileCategory.COURT_RECORD:
        courtDocumentFolder = CourtDocumentFolder.COURT_DOCUMENTS
        break
      case CaseFileCategory.RULING:
        courtDocumentFolder = CourtDocumentFolder.COURT_DOCUMENTS
        break
      case CaseFileCategory.CASE_FILE_CONTENTS:
        courtDocumentFolder = CourtDocumentFolder.CASE_DOCUMENTS
        break
      case CaseFileCategory.CASE_FILE:
        courtDocumentFolder = CourtDocumentFolder.CASE_DOCUMENTS
        break
      default:
        courtDocumentFolder = CourtDocumentFolder.CASE_DOCUMENTS
    }

    return courtDocumentFolder
  }

  private async throttleUpload(
    file: CaseFile,
    theCase: Case,
    user?: User,
  ): Promise<string> {
    await this.throttle.catch((reason) => {
      this.logger.info('Previous upload failed', { reason })
    })

    const content = await this.awsS3Service.getObject(file.key ?? '')

    const courtDocumentFolder = this.getCourtDocumentFolder(file)

    return this.courtService.createDocument(
      theCase.id,
      theCase.courtId,
      theCase.courtCaseNumber,
      courtDocumentFolder,
      file.name,
      file.name,
      file.type,
      content,
      user,
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

  createPresignedPost(
    caseId: string,
    createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    const { fileName, type } = createPresignedPost

    return this.awsS3Service.createPresignedPost(
      `uploads/${caseId}/${uuid()}/${fileName}`,
      type,
    )
  }

  async createCaseFile(
    caseId: string,
    createFile: CreateFileDto,
  ): Promise<CaseFile> {
    const { key } = createFile

    const regExp = new RegExp(`^uploads/${caseId}/.{36}/(.*)$`)

    if (!regExp.test(key)) {
      throw new BadRequestException(
        `${key} is not a valid key for case ${caseId}`,
      )
    }

    return this.fileModel.create({
      ...createFile,
      state: CaseFileState.STORED_IN_RVG,
      caseId,
      name: createFile.key.slice(NAME_BEGINS_INDEX),
    })
  }

  async getAllCaseFiles(caseId: string): Promise<CaseFile[]> {
    return this.fileModel.findAll({
      where: { caseId, state: { [Op.not]: CaseFileState.DELETED } },
      order: [['created', 'DESC']],
    })
  }

  async getCaseFileSignedUrl(file: CaseFile): Promise<SignedUrl> {
    if (!file.key) {
      throw new NotFoundException(`File ${file.id} does not exists in AWS S3`)
    }

    const exists = await this.awsS3Service.objectExists(file.key)

    if (!exists) {
      // Fire and forget, no need to wait for the result
      this.fileModel.update({ key: null }, { where: { id: file.id } })

      throw new NotFoundException(`File ${file.id} does not exists in AWS S3`)
    }

    return this.awsS3Service.getSignedUrl(file.key)
  }

  async deleteCaseFile(file: CaseFile): Promise<DeleteFileResponse> {
    const success = await this.deleteFileFromDatabase(file.id)

    if (success && file.key) {
      // Fire and forget, no need to wait for the result
      this.tryDeleteFileFromS3(file.key)
    }

    return { success }
  }

  async uploadCaseFileToCourt(
    file: CaseFile,
    theCase: Case,
    user?: User,
  ): Promise<UploadFileToCourtResponse> {
    await this.refreshFormatMessage()

    if (file.state === CaseFileState.STORED_IN_COURT) {
      return { success: true }
    }

    if (!file.key) {
      throw new NotFoundException(`File ${file.id} does not exists in AWS S3`)
    }

    const exists = await this.awsS3Service.objectExists(file.key)

    if (!exists) {
      // Fire and forget, no need to wait for the result
      this.fileModel.update({ key: null }, { where: { id: file.id } })

      throw new NotFoundException(`File ${file.id} does not exists in AWS S3`)
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
}

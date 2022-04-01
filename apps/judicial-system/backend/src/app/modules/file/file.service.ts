import { uuid } from 'uuidv4'
import { Op } from 'sequelize'
import { Transaction } from 'sequelize/types'

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { CaseFileState } from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { writeFile } from '../../formatters'
import { AwsS3Service } from '../aws-s3'
import { CourtService } from '../court'
import { CreateFileDto } from './dto/createFile.dto'
import { CreatePresignedPostDto } from './dto/createPresignedPost.dto'
import { PresignedPost } from './models/presignedPost.model'
import { CaseFile } from './models/file.model'
import { DeleteFileResponse } from './models/deleteFile.response'
import { SignedUrl } from './models/signedUrl.model'
import { UploadFileToCourtResponse } from './models/uploadFileToCourt.response'

// Files are stored in AWS S3 under a key which has the following format:
// uploads/<uuid>/<uuid>/<filename>
// As uuid-s have length 36, the filename starts at position 82 in the key.
const NAME_BEGINS_INDEX = 82

@Injectable()
export class FileService {
  private throttle = Promise.resolve('')

  constructor(
    @InjectModel(CaseFile) private readonly fileModel: typeof CaseFile,
    private readonly courtService: CourtService,
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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

  private async throttleUploadStream(
    file: CaseFile,
    user: User,
    caseId: string,
    courtId?: string,
    courtCaseNumber?: string,
  ): Promise<string> {
    await this.throttle.catch((reason) => {
      this.logger.info('Previous upload failed', { reason })
    })

    const content = await this.awsS3Service.getObject(file.key ?? '')

    if (!environment.production) {
      writeFile(`${file.name}`, content)
    }

    return this.courtService.createDocument(
      user,
      caseId,
      courtId ?? '',
      courtCaseNumber ?? '',
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
    user: User,
    file: CaseFile,
    caseId: string,
    courtId?: string,
    courtCaseNumber?: string,
  ): Promise<UploadFileToCourtResponse> {
    if (file.state === CaseFileState.STORED_IN_COURT) {
      throw new BadRequestException(
        `File ${file.id} has already been uploaded to court`,
      )
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

    this.throttle = this.throttleUploadStream(
      file,
      user,
      caseId,
      courtId,
      courtCaseNumber,
    )

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
  ): Promise<void> {
    const promisedUpdate = transaction
      ? this.fileModel.update(update, {
          where: { id: fileId, caseId },
          transaction,
        })
      : this.fileModel.update(update, {
          where: { id: fileId, caseId },
        })

    const [numberOfAffectedRows] = await promisedUpdate

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
  }
}

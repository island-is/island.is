import { uuid } from 'uuidv4'
import { Op } from 'sequelize'

import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { CaseFileState } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { writeFile } from '../../formatters'
import { CourtService } from '../court'
import { AwsS3Service } from './awsS3.service'
import { CreateFileDto, CreatePresignedPostDto } from './dto'
import {
  PresignedPost,
  CaseFile,
  DeleteFileResponse,
  SignedUrl,
  UploadFileToCourtResponse,
} from './models'

@Injectable()
export class FileService {
  private throttle = Promise.resolve('')

  constructor(
    @InjectModel(CaseFile)
    private readonly fileModel: typeof CaseFile,
    private readonly courtService: CourtService,
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async deleteFileFromDatabase(id: string): Promise<boolean> {
    this.logger.debug(`Deleting file ${id} from database`)

    const [nrOfRowsUpdated] = await this.fileModel.update(
      { state: CaseFileState.DELETED },
      { where: { id } },
    )

    return nrOfRowsUpdated > 0
  }

  private async tryDeleteFileFromS3(key: string) {
    this.logger.debug(`Attempting to delete file ${key} from S3`)

    // We don't really care if this succeeds
    try {
      await this.awsS3Service.deleteObject(key)
    } catch (error) {
      this.logger.error(`Error while deleting file ${key} from S3`, error)
    }
  }

  private async throttleUploadStream(
    file: CaseFile,
    courtId: string | undefined,
  ): Promise<string> {
    this.logger.debug(
      `Waiting to upload file ${file.id} of case ${file.caseId}`,
    )

    await this.throttle.catch((reason) => {
      this.logger.error('Previous upload failed', { reason })
    })

    this.logger.debug(
      `Starting to upload file ${file.id} of case ${file.caseId}`,
    )

    const content = await this.awsS3Service.getObject(file.key)

    if (!environment.production) {
      writeFile(`${file.name}`, content)
    }

    const streamId = this.courtService.uploadStream(
      courtId,
      file.name,
      file.type,
      content,
    )

    this.logger.debug(`Done uploading file ${file.id} of case ${file.caseId}`)

    return streamId
  }

  async findById(id: string, caseId: string): Promise<CaseFile | null> {
    return this.fileModel.findOne({
      where: {
        id,
        caseId,
        state: { [Op.not]: CaseFileState.DELETED },
      },
    })
  }

  createCasePresignedPost(
    caseId: string,
    createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    this.logger.debug(`Creating a presigned post for case ${caseId}`)

    const { fileName, type } = createPresignedPost

    return this.awsS3Service.createPresignedPost(
      `${caseId}/${uuid()}/${fileName}`,
      type,
    )
  }

  async createCaseFile(
    caseId: string,
    createFile: CreateFileDto,
  ): Promise<CaseFile> {
    this.logger.debug(`Creating a file for case ${caseId}`)

    const { key } = createFile

    const regExp = new RegExp(`^${caseId}/.{36}/(.*)$`)

    if (!regExp.test(key)) {
      throw new BadRequestException(`${key} is not a valid key`)
    }

    return this.fileModel.create({
      ...createFile,
      caseId,
      name: createFile.key.slice(74), // prefixed by two uuids, a forward slash and an underscore
    })
  }

  async getAllCaseFiles(caseId: string): Promise<CaseFile[]> {
    this.logger.debug(`Getting all files for case ${caseId}`)

    return this.fileModel.findAll({
      where: {
        caseId,
        state: { [Op.not]: CaseFileState.DELETED },
      },
      order: [['created', 'DESC']],
    })
  }

  async getCaseFileSignedUrl(
    caseId: string,
    file: CaseFile,
  ): Promise<SignedUrl> {
    this.logger.debug(
      `Getting a signed url for file ${file.id} of case ${caseId}`,
    )

    if (file.state === CaseFileState.BOKEN_LINK) {
      throw new NotFoundException(
        `File ${file.id} of case ${caseId} does not exists in AWS S3`,
      )
    }

    const exists = await this.awsS3Service.objectExists(file.key)

    if (!exists) {
      // Fire and forget, no need to wait for the result
      this.fileModel.update(
        { state: CaseFileState.BOKEN_LINK },
        { where: { id: file.id } },
      )
      throw new NotFoundException(
        `File ${file.id} of case ${caseId} does not exists in AWS S3`,
      )
    }

    return this.awsS3Service.getSignedUrl(file.key)
  }

  async deleteCaseFile(
    caseId: string,
    file: CaseFile,
  ): Promise<DeleteFileResponse> {
    this.logger.debug(`Deleting file ${file.id} of case ${caseId}`)

    const success = await this.deleteFileFromDatabase(file.id)

    if (success) {
      // Fire and forget, no need to wait for the result
      this.tryDeleteFileFromS3(file.key)
    }

    return { success }
  }

  async uploadCaseFileToCourt(
    caseId: string,
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    file: CaseFile,
  ): Promise<UploadFileToCourtResponse> {
    this.logger.debug(`Uploading file ${file.id} of case ${caseId} to court`)

    if (file.state === CaseFileState.STORED_IN_COURT) {
      throw new ForbiddenException(
        `File ${file.id} of case ${caseId} has already been uploaded to court`,
      )
    }

    if (file.state === CaseFileState.BOKEN_LINK) {
      throw new NotFoundException(
        `File ${file.id} of case ${caseId} does not exists in AWS S3`,
      )
    }

    const exists = await this.awsS3Service.objectExists(file.key)

    if (!exists) {
      // Fire and forget, no need to wait for the result
      this.fileModel.update(
        { state: CaseFileState.BOKEN_LINK },
        { where: { id: file.id } },
      )
      throw new NotFoundException(
        `File ${file.id} of case ${caseId} does not exists in AWS S3`,
      )
    }

    this.throttle = this.throttleUploadStream(file, courtId)

    const streamId = await this.throttle

    const documentId = await this.courtService.createDocument(
      courtId,
      courtCaseNumber,
      file.name,
      file.name,
      streamId,
    )

    const s3Key = file.key

    const [nrOfRowsUpdated] = await this.fileModel.update(
      { state: CaseFileState.STORED_IN_COURT, key: documentId },
      { where: { id: file.id } },
    )

    const success = nrOfRowsUpdated > 0

    if (success) {
      // Fire and forget, no need to wait for the result
      this.tryDeleteFileFromS3(s3Key)
    }

    return { success }
  }
}

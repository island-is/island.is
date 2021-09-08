import { uuid } from 'uuidv4'

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { AwsS3Service } from './awsS3.service'
import { CreateFileDto, CreatePresignedPostDto } from './dto'
import {
  PresignedPost,
  CaseFile,
  DeleteFileResponse,
  SignedUrl,
} from './models'

@Injectable()
export class FileService {
  constructor(
    @InjectModel(CaseFile)
    private readonly fileModel: typeof CaseFile,
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async deleteFileFromDatabase(id: string): Promise<boolean> {
    this.logger.debug(`Deleting file ${id} from database`)

    const nrOfRowsDeleted = await this.fileModel.destroy({ where: { id } })

    return nrOfRowsDeleted > 0
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

  async findById(id: string): Promise<CaseFile | null> {
    return this.fileModel.findByPk(id)
  }

  createCasePresignedPost(
    caseId: string,
    createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    this.logger.debug(`Creating a presigned post for case ${caseId}`)

    return this.awsS3Service.createPresignedPost(
      `${caseId}/${uuid()}/${createPresignedPost.fileName}`,
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
      where: { caseId },
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

    const exists = await this.awsS3Service.objectExists(file.key)

    if (!exists) {
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
}

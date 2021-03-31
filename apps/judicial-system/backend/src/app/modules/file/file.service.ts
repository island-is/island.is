import { uuid } from 'uuidv4'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AwsS3Service } from './awsS3.service'
import { CreateFileDto, CreatePresignedPostDto } from './dto'
import { PresignedPost, File, DeleteFileResponse } from './models'

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File)
    private readonly fileModel: typeof File,
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  createCasePresignedPost(
    caseId: string,
    createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    return this.awsS3Service.createPresignedPost(
      `${caseId}/${uuid()}_${createPresignedPost.fileName}`,
    )
  }

  createCaseFile(caseId: string, createFile: CreateFileDto): Promise<File> {
    const { key } = createFile

    const regExp = new RegExp(`^${caseId}/.{36}_(.*)$`)

    if (!regExp.test(key)) {
      throw new BadRequestException(`${key} is not a valid key`)
    }

    return this.fileModel.create({
      ...createFile,
      caseId,
      name: createFile.key.slice(74), // prefixed by two uuids, a forward slash and an underscore
    })
  }

  getAllCaseFiles(caseId: string): Promise<File[]> {
    this.logger.debug(`Getting all files for case ${caseId}`)

    return this.fileModel.findAll({
      where: { caseId },
      order: [['created', 'DESC']],
    })
  }

  getCaseFileById(id: string): Promise<File> {
    this.logger.debug(`Get case file by id ${id}`)

    return this.fileModel.findByPk(id)
  }

  async deleteFile(file: File): Promise<DeleteFileResponse> {
    await this.deleteFileFromDatabase(file.id)
    return this.awsS3Service.deleteFile(file.key)
  }

  deleteFileFromDatabase(id: string): Promise<boolean> {
    this.logger.debug(`Delete case file by id ${id}`)

    const success = this.fileModel
      .destroy({ where: { id } })
      .then((nrOfRowsDeleted) => {
        return nrOfRowsDeleted === 1
      })
      .error((err) => {
        this.logger.error(err)
        return false
      })

    return success
  }

  deleteFileFromS3(key: string): Promise<DeleteFileResponse> {
    return this.awsS3Service.deleteFile(key)
  }
}

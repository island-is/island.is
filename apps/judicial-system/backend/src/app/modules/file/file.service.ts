import { uuid } from 'uuidv4'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AwsS3Service } from './awsS3.service'
import { CreateFileDto, CreatePresignedPostDto } from './dto'
import { PresignedPost, File } from './models'

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File)
    private readonly file: typeof File,
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  createPresignedPost(
    caseId: string,
    createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    return this.awsS3Service.createPresignedPost(
      `${caseId}/${uuid()}_${createPresignedPost.fileName}`,
    )
  }

  createFile(caseId: string, createFile: CreateFileDto): Promise<File> {
    const { key } = createFile

    const regExp = new RegExp(`^${caseId}/.{36}_(.*)$`)

    if (!regExp.test(key)) {
      throw new BadRequestException(`${key} is not a valid key`)
    }

    return this.file.create({
      ...createFile,
      caseId,
      name: createFile.key.slice(74), // prefixed by two uuids, a forward slash and an underscore
    })
  }
}

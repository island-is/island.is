import { uuid } from 'uuidv4'
import { Op } from 'sequelize'

import {
  BadRequestException,
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
import { AwsS3Service } from '../aws-s3'
import { CourtService } from '../court'
import { CreateFileDto, CreatePresignedPostDto } from './dto'
import {
  PresignedPost,
  CaseFile,
  DeleteFileResponse,
  SignedUrl,
  UploadFileToCourtResponse,
} from './models'

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

  private async deleteFileFromDatabase(id: string): Promise<boolean> {
    this.logger.debug(`Deleting file ${id} from the database`)

    const [nrOfRowsUpdated] = await this.fileModel.update(
      { state: CaseFileState.DELETED },
      { where: { id } },
    )

    return nrOfRowsUpdated > 0
  }

  private async tryDeleteFileFromS3(key: string) {
    this.logger.debug(`Attempting to delete file ${key} from AWS S3`)

    // We don't really care if this succeeds
    try {
      await this.awsS3Service.deleteObject(key)
    } catch (error) {
      this.logger.info(`Could not delete file ${key} from AWS S3`, error)
    }
  }

  private async throttleUploadStream(
    file: CaseFile,
    courtId: string | undefined,
  ): Promise<string> {
    await this.throttle.catch((reason) => {
      this.logger.warn('Previous upload failed', { reason })
    })

    const content = await this.awsS3Service.getObject(file.key)

    if (!environment.production) {
      writeFile(`${file.name}`, content)
    }

    return this.courtService.uploadStream(
      courtId,
      file.name,
      file.type,
      content,
    )
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
      caseId,
      name: createFile.key.slice(NAME_BEGINS_INDEX),
    })
  }

  async getAllCaseFiles(caseId: string): Promise<CaseFile[]> {
    return this.fileModel.findAll({
      where: {
        caseId,
        state: { [Op.not]: CaseFileState.DELETED },
      },
      order: [['created', 'DESC']],
    })
  }

  async getCaseFileSignedUrl(file: CaseFile): Promise<SignedUrl> {
    if (file.state !== CaseFileState.STORED_IN_RVG) {
      throw new NotFoundException(`File ${file.id} does not exists in AWS S3`)
    }

    const exists = await this.awsS3Service.objectExists(file.key)

    if (!exists) {
      // Fire and forget, no need to wait for the result
      this.fileModel.update(
        { state: CaseFileState.BOKEN_LINK },
        { where: { id: file.id } },
      )
      throw new NotFoundException(`File ${file.id} does not exists in AWS S3`)
    }

    return this.awsS3Service.getSignedUrl(file.key)
  }

  async deleteCaseFile(file: CaseFile): Promise<DeleteFileResponse> {
    const success = await this.deleteFileFromDatabase(file.id)

    if (success && file.state === CaseFileState.STORED_IN_RVG) {
      // Fire and forget, no need to wait for the result
      this.tryDeleteFileFromS3(file.key)
    }

    return { success }
  }

  async uploadCaseFileToCourt(
    courtId: string | undefined,
    courtCaseNumber: string | undefined,
    file: CaseFile,
  ): Promise<UploadFileToCourtResponse> {
    if (file.state === CaseFileState.STORED_IN_COURT) {
      throw new BadRequestException(
        `File ${file.id} has already been uploaded to court`,
      )
    }

    if (file.state !== CaseFileState.STORED_IN_RVG) {
      throw new NotFoundException(`File ${file.id} does not exists in AWS S3`)
    }

    const exists = await this.awsS3Service.objectExists(file.key)

    if (!exists) {
      // Fire and forget, no need to wait for the result
      this.fileModel.update(
        { state: CaseFileState.BOKEN_LINK },
        { where: { id: file.id } },
      )

      throw new NotFoundException(`File ${file.id} does not exists in AWS S3`)
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

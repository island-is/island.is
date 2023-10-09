import archiver from 'archiver'
import { Op, Sequelize } from 'sequelize'
import { Transaction } from 'sequelize/types'
import { Writable } from 'stream'
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

import type { User } from '@island.is/judicial-system/types'
import {
  availableCaseFileCategoriesForIndictmentCases,
  availableCaseFileCategoriesForRestrictionAndInvestigationCases,
  CaseFileCategory,
  CaseFileState,
  indictmentCases,
  investigationCases,
  isIndictmentCase,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { AwsS3Service } from '../aws-s3'
import { Case } from '../case'
import { PDFService } from '../case/pdf.service'
import { CourtDocumentFolder, CourtService } from '../court'
import { CreateFileDto } from './dto/createFile.dto'
import { CreatePresignedPostDto } from './dto/createPresignedPost.dto'
import { UpdateFileDto } from './dto/updateFile.dto'
import { DeleteFileResponse } from './models/deleteFile.response'
import { CaseFile } from './models/file.model'
import { PresignedPost } from './models/presignedPost.model'
import { SignedUrl } from './models/signedUrl.model'
import { UploadFileToCourtResponse } from './models/uploadFileToCourt.response'

// Files are stored in AWS S3 under a key which has the following formats:
// uploads/<uuid>/<uuid>/<filename> for restriction and investigation cases
// As uuid-s have length 36, the filename starts at position 82 in the key.
const NAME_BEGINS_INDEX = 82
// indictments/<uuid>/<uuid>/<filename> for indictment cases
// As uuid-s have length 36, the filename starts at position 82 in the key.
const INDICTMENT_NAME_BEGINS_INDEX = 86

@Injectable()
export class FileService {
  private throttle = Promise.resolve('')

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(CaseFile) private readonly fileModel: typeof CaseFile,
    private readonly courtService: CourtService,
    private readonly awsS3Service: AwsS3Service,
    private readonly pdfService: PDFService,
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

  private async tryDeleteFileFromS3(file: CaseFile): Promise<boolean> {
    this.logger.debug(`Attempting to delete file ${file.key} from AWS S3`)

    if (!file.key) {
      return true
    }

    return this.awsS3Service.deleteObject(file.key).catch((reason) => {
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
      case CaseFileCategory.COVER_LETTER:
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

  private async throttleUpload(
    file: CaseFile,
    theCase: Case,
    user: User,
  ): Promise<string> {
    // Serialise all uploads in this process
    await this.throttle.catch((reason) => {
      this.logger.info('Previous upload failed', { reason })
    })

    const content = await this.awsS3Service.getObject(file.key ?? '')

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

  private zipFiles(
    files: Array<{ data: Buffer; name: string }>,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buffs: Buffer[] = []
      const converter = new Writable()

      converter._write = (chunk, _encoding, cb) => {
        buffs.push(chunk)
        process.nextTick(cb)
      }

      converter.on('finish', () => {
        resolve(Buffer.concat(buffs))
      })

      const archive = archiver('zip')

      archive.on('error', (err) => {
        reject(err)
      })

      archive.pipe(converter)

      for (const file of files) {
        archive.append(file.data, { name: file.name })
      }

      archive.finalize()
    })
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

  async getAll(theCase: Case, user: User): Promise<Buffer> {
    const filesToZip: Array<{ data: Buffer; name: string }> = []
    const allowedCategories = [
      ...restrictionCases,
      ...investigationCases,
    ].includes(theCase.type)
      ? availableCaseFileCategoriesForRestrictionAndInvestigationCases
      : indictmentCases.includes(theCase.type)
      ? availableCaseFileCategoriesForIndictmentCases
      : []

    const caseFilesByCategory = await this.fileModel.findAll({
      where: {
        caseId: theCase.id,
        state: { [Op.not]: CaseFileState.DELETED },
        category: allowedCategories,
      },
    })

    for (const file of caseFilesByCategory) {
      await this.awsS3Service
        .getObject(file.key ?? '')
        .then((content) => filesToZip.push({ data: content, name: file.name }))
        .catch((reason) =>
          // Tolerate failure, but log what happened
          this.logger.warn(
            `Could not get file ${file.id} of case ${file.caseId} from AWS S3`,
            { reason },
          ),
        )
    }

    filesToZip.push(
      {
        data: await this.pdfService.getRequestPdf(theCase),
        name: 'krafa.pdf',
      },
      {
        data: await this.pdfService.getCourtRecordPdf(theCase, user),
        name: 'þingbok.pdf',
      },
      {
        data: await this.pdfService.getRulingPdf(theCase),
        name: 'urskurður.pdf',
      },
    )

    return this.zipFiles(filesToZip)
  }

  createPresignedPost(
    theCase: Case,
    createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    const { fileName, type } = createPresignedPost

    return this.awsS3Service.createPresignedPost(
      `${isIndictmentCase(theCase.type) ? 'indictments' : 'uploads'}/${
        theCase.id
      }/${uuid()}/${fileName}`,
      type,
    )
  }

  async createCaseFile(
    theCase: Case,
    createFile: CreateFileDto,
  ): Promise<CaseFile> {
    const { key } = createFile

    const regExp = new RegExp(
      `^${isIndictmentCase(theCase.type) ? 'indictments' : 'uploads'}/${
        theCase.id
      }/.{36}/(.*)$`,
    )

    if (!regExp.test(key)) {
      throw new BadRequestException(
        `${key} is not a valid key for case ${theCase.id}`,
      )
    }

    return this.fileModel.create({
      ...createFile,
      state: CaseFileState.STORED_IN_RVG,
      caseId: theCase.id,
      name: createFile.key.slice(
        isIndictmentCase(theCase.type)
          ? INDICTMENT_NAME_BEGINS_INDEX
          : NAME_BEGINS_INDEX,
      ),
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

  async deleteCaseFile(
    file: CaseFile,
    transaction?: Transaction,
  ): Promise<DeleteFileResponse> {
    const success = await this.deleteFileFromDatabase(file.id, transaction)

    if (success) {
      // Fire and forget, no need to wait for the result
      this.tryDeleteFileFromS3(file)
    }

    return { success }
  }

  async uploadCaseFileToCourt(
    file: CaseFile,
    theCase: Case,
    user: User,
  ): Promise<UploadFileToCourtResponse> {
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

  async archive(file: CaseFile): Promise<boolean> {
    if (
      !file.key ||
      !file.key.startsWith('indictments/') ||
      file.key.startsWith('indictments/completed/')
    ) {
      return true
    }

    return this.awsS3Service
      .copyObject(
        file.key,
        file.key.replace('indictments/', 'indictments/completed/'),
      )
      .then((newKey) =>
        this.fileModel.update({ key: newKey }, { where: { id: file.id } }),
      )
      .then(() => {
        // Fire and forget, no need to wait for the result
        this.tryDeleteFileFromS3(file)

        return true
      })
      .catch((reason) => {
        this.logger.error(
          `Failed to archive file ${file.id} of case ${file.caseId}`,
          { reason },
        )

        return false
      })
  }

  async resetCaseFileStates(caseId: string, transaction: Transaction) {
    await this.fileModel.update(
      { state: CaseFileState.STORED_IN_RVG },
      { where: { caseId, state: CaseFileState.STORED_IN_COURT }, transaction },
    )
  }
}

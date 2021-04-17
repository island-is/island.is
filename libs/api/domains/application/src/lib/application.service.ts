import { Injectable } from '@nestjs/common'
import { UpdateApplicationInput } from './dto/updateApplication.input'
import { CreateApplicationInput } from './dto/createApplication.input'
import { AddAttachmentInput } from './dto/addAttachment.input'
import { DeleteAttachmentInput } from './dto/deleteAttachment.input'
import { logger } from '@island.is/logging'
import { User, UserMiddleware } from '@island.is/auth-nest-tools'
import { ApolloError } from 'apollo-server-express'
import { ApplicationsApi } from '../../gen/fetch'
import { UpdateApplicationExternalDataInput } from './dto/updateApplicationExternalData.input'
import { SubmitApplicationInput } from './dto/submitApplication.input'
import { AssignApplicationInput } from './dto/assignApplication.input'
import { CreatePdfInput } from './dto/createPdf.input'
import { RequestFileSignatureInput } from './dto/requestFileSignature.input'
import { UploadSignedFileInput } from './dto/uploadSignedFile.input'
import { ApplicationApplicationsInput } from './dto/applicationApplications.input'
import { GetPresignedUrlInput } from './dto/getPresignedUrl.input'

const handleError = async (error: any) => {
  logger.error(JSON.stringify(error))

  if (error.json) {
    const json = await error.json()

    logger.error(json)

    throw new ApolloError(JSON.stringify(json), error.status)
  }

  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class ApplicationService {
  constructor(private _applicationApi: ApplicationsApi) {}

  applicationApiForUser(user: User) {
    return this._applicationApi.withMiddleware(new UserMiddleware(user))
  }

  async findOne(id: string, user: User) {
    return await this.applicationApiForUser(user)
      .applicationControllerFindOne({
        id,
      })
      .catch(handleError)
  }

  async findAll(
    nationalId: string,
    user: User,
    input?: ApplicationApplicationsInput,
  ) {
    return await this.applicationApiForUser(user)
      .applicationControllerFindAll({
        nationalId,
        typeId: input?.typeId?.join(','),
        status: input?.status?.join(','),
      })
      .catch(handleError)
  }

  async create(input: CreateApplicationInput, user: User) {
    return this.applicationApiForUser(user)
      .applicationControllerCreate({
        createApplicationDto: input,
      })
      .catch(handleError)
  }

  async update(input: UpdateApplicationInput, user: User) {
    const { id, ...updateApplicationDto } = input

    return await this.applicationApiForUser(user)
      .applicationControllerUpdate({
        id,
        updateApplicationDto,
      })
      .catch(handleError)
  }

  async addAttachment(input: AddAttachmentInput, user: User) {
    const { id, ...addAttachmentDto } = input

    return await this.applicationApiForUser(user)
      .applicationControllerAddAttachment({
        id,
        addAttachmentDto,
      })
      .catch(handleError)
  }

  async deleteAttachment(input: DeleteAttachmentInput, user: User) {
    const { id, ...deleteAttachmentDto } = input

    return await this.applicationApiForUser(user)
      .applicationControllerDeleteAttachment({
        id,
        deleteAttachmentDto,
      })
      .catch(handleError)
  }

  async updateExternalData(
    input: UpdateApplicationExternalDataInput,
    user: User,
  ) {
    const { id, ...populateExternalDataDto } = input

    return this.applicationApiForUser(
      user,
    ).applicationControllerUpdateExternalData({
      id,
      populateExternalDataDto,
    })
  }

  async submitApplication(input: SubmitApplicationInput, user: User) {
    const { id, ...updateApplicationStateDto } = input
    return this.applicationApiForUser(
      user,
    ).applicationControllerSubmitApplication({
      id,
      updateApplicationStateDto,
    })
  }

  async assignApplication(input: AssignApplicationInput, user: User) {
    return this.applicationApiForUser(
      user,
    ).applicationControllerAssignApplication({
      assignApplicationDto: input,
    })
  }

  async createPdfPresignedUrl(input: CreatePdfInput, user: User) {
    const { id, ...createPdfDto } = input
    return await this.applicationApiForUser(user)
      .applicationControllerCreatePdf({
        id,
        createPdfDto,
      })
      .catch(handleError)
  }

  async requestFileSignature(input: RequestFileSignatureInput, user: User) {
    const { id, ...requestFileSignatureDto } = input
    return await this.applicationApiForUser(user)
      .applicationControllerRequestFileSignature({
        id,
        requestFileSignatureDto,
      })
      .catch(handleError)
  }

  async uploadSignedFile(input: UploadSignedFileInput, user: User) {
    const { id, ...uploadSignedFileDto } = input
    return await this.applicationApiForUser(user)
      .applicationControllerUploadSignedFile({
        id,
        uploadSignedFileDto,
      })
      .catch(handleError)
  }

  async presignedUrl(input: GetPresignedUrlInput, user: User) {
    const { id, type } = input

    return await this.applicationApiForUser(user)
      .applicationControllerGetPresignedUrl({
        id,
        pdfType: type,
      })
      .catch(handleError)
  }
}

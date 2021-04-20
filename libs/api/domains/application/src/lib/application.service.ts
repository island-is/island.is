import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { Locale } from '@island.is/shared/types'

import { ApplicationsApi } from '../../gen/fetch'
import { UpdateApplicationInput } from './dto/updateApplication.input'
import { CreateApplicationInput } from './dto/createApplication.input'
import { AddAttachmentInput } from './dto/addAttachment.input'
import { DeleteAttachmentInput } from './dto/deleteAttachment.input'
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
  constructor(private applicationApi: ApplicationsApi) {}

  async findOne(id: string, authorization: string, locale: Locale) {
    return await this.applicationApi
      .applicationControllerFindOne({
        id,
        authorization,
        locale,
      })
      .catch(handleError)
  }

  async findAll(
    nationalId: string,
    authorization: string,
    locale: Locale,
    input?: ApplicationApplicationsInput,
  ) {
    return await this.applicationApi
      .applicationControllerFindAll({
        nationalId,
        authorization,
        locale,
        typeId: input?.typeId?.join(','),
        status: input?.status?.join(','),
      })
      .catch(handleError)
  }

  async create(input: CreateApplicationInput, authorization: string) {
    return this.applicationApi
      .applicationControllerCreate({
        createApplicationDto: input,
        authorization,
      })
      .catch(handleError)
  }

  async update(
    input: UpdateApplicationInput,
    authorization: string,
    locale: Locale,
  ) {
    const { id, ...updateApplicationDto } = input

    return await this.applicationApi
      .applicationControllerUpdate({
        id,
        updateApplicationDto,
        authorization,
        locale,
      })
      .catch(handleError)
  }

  async addAttachment(input: AddAttachmentInput, authorization: string) {
    const { id, ...addAttachmentDto } = input

    return await this.applicationApi
      .applicationControllerAddAttachment({
        id,
        addAttachmentDto,
        authorization,
      })
      .catch(handleError)
  }

  async deleteAttachment(input: DeleteAttachmentInput, authorization: string) {
    const { id, ...deleteAttachmentDto } = input

    return await this.applicationApi
      .applicationControllerDeleteAttachment({
        id,
        deleteAttachmentDto,
        authorization,
      })
      .catch(handleError)
  }

  async updateExternalData(
    input: UpdateApplicationExternalDataInput,
    authorization: string,
  ) {
    const { id, ...populateExternalDataDto } = input

    return this.applicationApi.applicationControllerUpdateExternalData({
      id,
      populateExternalDataDto,
      authorization,
    })
  }

  async submitApplication(
    input: SubmitApplicationInput,
    authorization: string,
  ) {
    const { id, ...updateApplicationStateDto } = input
    return this.applicationApi.applicationControllerSubmitApplication({
      id,
      updateApplicationStateDto,
      authorization,
    })
  }

  async assignApplication(
    input: AssignApplicationInput,
    authorization: string,
  ) {
    return this.applicationApi.applicationControllerAssignApplication({
      assignApplicationDto: input,
      authorization,
    })
  }

  async createPdfPresignedUrl(input: CreatePdfInput, authorization: string) {
    const { id, ...createPdfDto } = input
    return await this.applicationApi
      .applicationControllerCreatePdf({
        id,
        createPdfDto,
        authorization,
      })
      .catch(handleError)
  }

  async requestFileSignature(
    input: RequestFileSignatureInput,
    authorization: string,
  ) {
    const { id, ...requestFileSignatureDto } = input
    return await this.applicationApi
      .applicationControllerRequestFileSignature({
        id,
        requestFileSignatureDto,
        authorization,
      })
      .catch(handleError)
  }

  async uploadSignedFile(input: UploadSignedFileInput, authorization: string) {
    const { id, ...uploadSignedFileDto } = input
    return await this.applicationApi
      .applicationControllerUploadSignedFile({
        id,
        uploadSignedFileDto,
        authorization,
      })
      .catch(handleError)
  }

  async presignedUrl(input: GetPresignedUrlInput, authorization: string) {
    const { id, type } = input

    return await this.applicationApi
      .applicationControllerGetPresignedUrl({
        id,
        pdfType: type,
        authorization,
      })
      .catch(handleError)
  }
}

import { Injectable } from '@nestjs/common'
import { UpdateApplicationInput } from './dto/updateApplication.input'
import { CreateApplicationInput } from './dto/createApplication.input'
import { AddAttachmentInput } from './dto/addAttachment.input'
import { DeleteAttachmentInput } from './dto/deleteAttachment.input'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { ApplicationsApi } from '../../gen/fetch'
import { UpdateApplicationExternalDataInput } from './dto/updateApplicationExternalData.input'
import { SubmitApplicationInput } from './dto/submitApplication.input'
import { AssignApplicationInput } from './dto/assignApplication.input'
import { ApplicationResponseDtoTypeIdEnum } from '../../gen/fetch/models/ApplicationResponseDto'

const handleError = (error: any) => {
  logger.error(JSON.stringify(error))
  if (error.json) {
    error.json().then((errorMessage: unknown) => {
      logger.error(errorMessage)
    })
  }
  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class ApplicationService {
  constructor(private applicationApi: ApplicationsApi) {}

  async findOne(id: string, authorization: string) {
    return await this.applicationApi
      .applicationControllerFindOne({
        id,
        authorization,
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

  async findAllByType(
    typeId: ApplicationResponseDtoTypeIdEnum,
    authorization: string,
  ) {
    return await this.applicationApi
      .applicationControllerFindAll({ typeId, authorization })
      .catch(handleError)
  }

  async findAllByApplicant(
    nationalRegistryId: string,
    authorization: string,
    typeId?: ApplicationResponseDtoTypeIdEnum,
  ) {
    return await this.applicationApi
      .applicationControllerFindApplicantApplications({
        nationalRegistryId,
        typeId,
        authorization,
      })
      .catch(handleError)
  }

  async findAllByAssignee(
    nationalRegistryId: string,
    authorization: string,
    typeId?: ApplicationResponseDtoTypeIdEnum,
  ) {
    return await this.applicationApi
      .applicationControllerFindAssigneeApplications({
        nationalRegistryId,
        typeId,
        authorization,
      })
      .catch(handleError)
  }

  async update(input: UpdateApplicationInput, authorization: string) {
    const { id, ...updateApplicationDto } = input

    return await this.applicationApi
      .applicationControllerUpdate({
        id,
        updateApplicationDto,
        authorization,
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
}

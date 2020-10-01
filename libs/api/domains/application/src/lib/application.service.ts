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
import { GetApplicationsByUserInput } from './dto/getApplicationByUser.input'
import { ApplicationResponseDtoTypeIdEnum } from '../../gen/fetch/models/ApplicationResponseDto'

const handleError = (error) => {
  logger.error(error)
  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class ApplicationService {
  constructor(private applicationApi: ApplicationsApi) {}

  async findOne(id: string) {
    return await this.applicationApi
      .applicationControllerFindOne({
        id,
      })
      .catch(handleError)
  }

  async create(input: CreateApplicationInput) {
    return this.applicationApi.applicationControllerCreate({
      createApplicationDto: input,
    })
  }

  async findAllByType(typeId: ApplicationResponseDtoTypeIdEnum) {
    return await this.applicationApi
      .applicationControllerFindAll({ typeId })
      .catch(handleError)
  }

  async findAllByApplicant(input: GetApplicationsByUserInput) {
    return await this.applicationApi
      .applicationControllerFindApplicantApplications(input)
      .catch(handleError)
  }

  async findAllByAssignee(input: GetApplicationsByUserInput) {
    return await this.applicationApi
      .applicationControllerFindAssigneeApplications(input)
      .catch(handleError)
  }

  async update(input: UpdateApplicationInput) {
    const { id, ...updateApplicationDto } = input

    return await this.applicationApi
      .applicationControllerUpdate({
        id,
        updateApplicationDto,
      })
      .catch(handleError)
  }

  async addAttachment(input: AddAttachmentInput) {
    const { id, ...addAttachmentDto } = input

    return await this.applicationApi
      .applicationControllerAddAttachment({
        id,
        addAttachmentDto,
      })
      .catch(handleError)
  }

  async deleteAttachment(input: DeleteAttachmentInput) {
    const { id, ...deleteAttachmentDto } = input

    return await this.applicationApi
      .applicationControllerDeleteAttachment({
        id,
        deleteAttachmentDto,
      })
      .catch(handleError)
  }

  async updateExternalData(input: UpdateApplicationExternalDataInput) {
    const { id, ...populateExternalDataDto } = input

    return this.applicationApi.applicationControllerUpdateExternalData({
      id,
      populateExternalDataDto,
    })
  }

  async submitApplication(input: SubmitApplicationInput) {
    const { id, ...updateApplicationStateDto } = input
    return this.applicationApi.applicationControllerSubmitApplication({
      id,
      updateApplicationStateDto,
    })
  }
}

import { Injectable } from '@nestjs/common'
import { ApplicationApi, ApplicationTypeIdEnum } from '../../gen/fetch'
import { UpdateApplicationInput } from './dto/updateApplication.input'
import { CreateApplicationInput } from './dto/createApplication.input'
import { AddAttachmentInput } from './dto/addAttachment.input'
import { DeleteAttachmentInput } from './dto/deleteAttachment.input'

@Injectable()
export class ApplicationService {
  constructor(private applicationApi: ApplicationApi) {}

  async findOne(id: string) {
    return this.applicationApi.applicationControllerFindOne({
      id,
    })
  }

  async create(input: CreateApplicationInput) {
    return this.applicationApi.applicationControllerCreate({
      createApplicationDto: input,
    })
  }

  async findAllByType(typeId: ApplicationTypeIdEnum) {
    return this.applicationApi.applicationControllerFindAll({ typeId })
  }

  async update(input: UpdateApplicationInput) {
    const { id, ...updateApplicationDto } = input

    return this.applicationApi.applicationControllerUpdate({
      id,
      updateApplicationDto,
    })
  }

  async addAttachment(input: AddAttachmentInput) {
    const { id, ...addAttachmentDto } = input

    return this.applicationApi.applicationControllerAddAttachment({
      id,
      addAttachmentDto,
    })
  }

  async deleteAttachment(input: DeleteAttachmentInput) {
    const { id, ...deleteAttachmentDto } = input

    return this.applicationApi.applicationControllerDeleteAttachment({
      id,
      deleteAttachmentDto,
    })
  }
}

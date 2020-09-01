import { Injectable } from '@nestjs/common'
import {
  ApplicationApi,
  UpdateApplicationDto,
  ApplicationTypeIdEnum,
} from '../../gen/fetch'
import { CreateApplicationDto } from '../../gen/fetch/models/CreateApplicationDto'
import { UpdateApplicationExternalDataInput } from './dto/updateApplicationExternalData.input'

@Injectable()
export class ApplicationService {
  constructor(private applicationApi: ApplicationApi) {}

  async findOne(id: string) {
    return this.applicationApi.applicationControllerFindOne({
      id,
    })
  }

  async findAllByType(typeId: ApplicationTypeIdEnum) {
    return this.applicationApi.applicationControllerFindAll({ typeId })
  }

  async create(input: CreateApplicationDto) {
    return this.applicationApi.applicationControllerCreate({
      createApplicationDto: input,
    })
  }

  async update(input: UpdateApplicationDto) {
    return this.applicationApi.applicationControllerUpdate({
      id: input.id,
      updateApplicationDto: input,
    })
  }

  async updateExternalData(input: UpdateApplicationExternalDataInput) {
    const { id, ...populateExternalDataDto } = input

    return this.applicationApi.applicationControllerUpdateExternalData({
      id,
      populateExternalDataDto,
    })
  }
}

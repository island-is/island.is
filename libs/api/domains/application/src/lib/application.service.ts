import { Injectable } from '@nestjs/common'
import {
  ApplicationApi,
  Configuration,
  UpdateApplicationDto,
  querystring,
  ApplicationTypeIdEnum,
} from '../../gen/fetch'
import { CreateApplicationDto } from '../../gen/fetch/models/CreateApplicationDto'

@Injectable()
export class ApplicationService {
  constructor(private applicationApi: ApplicationApi) {}

  async findOne(id: string) {
    return this.applicationApi.applicationControllerFindOne({
      id,
    })
  }

  async findAllByType(typeId: ApplicationTypeIdEnum) {
    return this.api.applicationControllerFindAll({ typeId })
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
}

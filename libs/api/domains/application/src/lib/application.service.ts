import { Injectable } from '@nestjs/common'
import {
  ApplicationApi,
  Configuration,
  UpdateApplicationDto,
  querystring,
  ApplicationTypeIdEnum,
} from '../../gen/fetch'
import fetch from 'isomorphic-fetch'
import { CreateApplicationDto } from '../../gen/fetch/models/CreateApplicationDto'

@Injectable()
export class ApplicationService {
  api = new ApplicationApi(
    new Configuration({
      fetchApi: fetch,
      basePath: 'http://localhost:3333',
    }),
  )

  async findOne(id: string) {
    return this.api.applicationControllerFindOne({
      id,
    })
  }

  async findAllByType(typeId: ApplicationTypeIdEnum) {
    return this.api.applicationControllerFindAll({ typeId })
  }

  async create(input: CreateApplicationDto) {
    return this.api.applicationControllerCreate({
      createApplicationDto: input,
    })
  }

  async update(input: UpdateApplicationDto) {
    return this.api.applicationControllerUpdate({
      id: input.id,
      updateApplicationDto: input,
    })
  }
}

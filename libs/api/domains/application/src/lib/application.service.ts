import { Injectable } from '@nestjs/common'
import { ApplicationApi, Configuration } from '../../gen/fetch'
import fetch from 'isomorphic-fetch'

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

  async create(input: any) {
    return this.api.applicationControllerCreate({
      applicationDto: input,
    })
  }
}

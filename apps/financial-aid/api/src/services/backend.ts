import { RESTDataSource } from 'apollo-datasource-rest'

import { Injectable } from '@nestjs/common'

import { Application, Municipality } from '@island.is/financial-aid/types'

import { CreateApplicationInput } from '../app/modules/application/dto'

import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backend.url}/api`

  // willSendRequest(req: RequestOptions) {
  //   req.headers.set('authorization', this.context.req.headers.authorization)
  //   req.headers.set('cookie', this.context.req.headers.cookie)
  // }

  getApplications(): Promise<Application[]> {
    return this.get('applications')
  }

  getMunicipality(id: string): Promise<Municipality> {
    return this.get(`municipality/${id}`)
  }

  createApplication(
    createApplication: CreateApplicationInput,
  ): Promise<Application> {
    return this.post('application', createApplication)
  }
}

export default BackendAPI

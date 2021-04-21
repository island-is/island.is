import { RESTDataSource } from 'apollo-datasource-rest'

import { Injectable } from '@nestjs/common'

import { Application } from '@island.is/financial-aid/types'

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
}

export default BackendAPI

import { Injectable } from '@nestjs/common'
import { DataSourceConfig } from 'apollo-datasource'
import { RESTDataSource } from 'apollo-datasource-rest'

import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  constructor() {
    super()
    this.initialize({} as DataSourceConfig<any>)
    this.baseURL = `${environment.backendUrl}/api/icelandic-names-registry`
  }

  getAll(): Promise<any> {
    return this.get(`/all`)
  }

  getById(id: number): Promise<any> {
    return this.get(`/${id}`)
  }

  getByInitialLetter(initialLetter: string): Promise<any> {
    return this.get(`/initial-letter/${initialLetter}`)
  }

  updateById(id: number, body: object): Promise<any> {
    return this.patch(`/${id}`, body)
  }

  create(body: object): Promise<any> {
    return this.put(`/`, body)
  }

  deleteById(id: number): Promise<any> {
    return this.delete(`/${id}`)
  }
}

export default BackendAPI

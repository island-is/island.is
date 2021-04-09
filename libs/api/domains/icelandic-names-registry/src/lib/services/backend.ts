import { Injectable } from '@nestjs/common'
import { DataSourceConfig } from 'apollo-datasource'
import { RESTDataSource } from 'apollo-datasource-rest'

import { IcelandicName } from '@island.is/icelandic-names-registry-types'

import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  constructor() {
    super()
    this.initialize({} as DataSourceConfig<any>)
    this.baseURL = `${environment.backendUrl}/api/icelandic-names-registry`
  }

  getAll(): Promise<IcelandicName[]> {
    return this.get(`/all`)
  }

  getById(id: number): Promise<IcelandicName> {
    return this.get(`/${id}`)
  }

  getByInitialLetter(initialLetter: string): Promise<IcelandicName[]> {
    return this.get(`/initial-letter/${initialLetter}`)
  }

  getBySearch(q: string): Promise<IcelandicName[]> {
    return this.get(`/search/${q}`)
  }

  updateById(id: number, body: object): Promise<IcelandicName> {
    return this.patch(`/${id}`, body)
  }

  create(body: object): Promise<IcelandicName> {
    return this.put(`/`, body)
  }

  deleteById(id: number): Promise<void> {
    return this.delete(`/${id}`)
  }
}

export default BackendAPI

import { Inject, Injectable } from '@nestjs/common'
import { DataSourceConfig } from 'apollo-datasource'
import { RESTDataSource } from 'apollo-datasource-rest'

import {
  IcelandicName,
  ICELANDIC_NAMES_REGISTRY_OPTIONS,
  IcelandicNamesRegistryOptions,
} from '@island.is/icelandic-names-registry-types'

import { IcelandicNameBody } from '../dto/icelandic-name.input'

@Injectable()
class BackendAPI extends RESTDataSource {
  constructor(
    @Inject(ICELANDIC_NAMES_REGISTRY_OPTIONS)
    private readonly options: IcelandicNamesRegistryOptions,
  ) {
    super()
    this.initialize({} as DataSourceConfig<void>)
    this.baseURL = `${this.options.backendUrl}/api/icelandic-names-registry`
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

  updateById(id: number, body: IcelandicNameBody): Promise<IcelandicName> {
    return this.patch(`/${id}`, body)
  }

  create(body: IcelandicNameBody): Promise<IcelandicName> {
    return this.put(`/`, body)
  }

  deleteById(id: number): Promise<void> {
    return this.delete(`/${id}`)
  }
}

export default BackendAPI

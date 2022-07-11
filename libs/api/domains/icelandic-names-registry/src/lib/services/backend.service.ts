import { Inject, Injectable } from '@nestjs/common'
import { DataSourceConfig } from 'apollo-datasource'
import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import type { IcelandicNamesRegistryOptions } from '@island.is/icelandic-names-registry-types'
import {
  IcelandicName,
  ICELANDIC_NAMES_REGISTRY_OPTIONS,
} from '@island.is/icelandic-names-registry-types'

import { CreateIcelandicNameInput } from '../dto/icelandic-name.input.dto'

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

  willSendRequest(_request: RequestOptions) {
    this.memoizedResults.clear()
  }

  getAll(): Promise<IcelandicName[]> {
    return this.get(`/names`)
  }

  getById(id: number): Promise<IcelandicName> {
    return this.get(`/names/${id}`, undefined, { cacheOptions: { ttl: 0 } })
  }

  getByInitialLetter(initialLetter: string): Promise<IcelandicName[]> {
    return this.get(`/names/initial-letter/${initialLetter}`)
  }

  getBySearch(q: string): Promise<IcelandicName[]> {
    return this.get(`/names/search/${q}`)
  }

  updateById(
    id: number,
    body: CreateIcelandicNameInput,
    authorization: string,
  ): Promise<IcelandicName> {
    return this.patch(`/names/${id}`, body, { headers: { authorization } })
  }

  create(
    body: CreateIcelandicNameInput,
    authorization: string,
  ): Promise<IcelandicName> {
    return this.post(`/names/`, body, { headers: { authorization } })
  }

  deleteById(id: number, authorization: string): Promise<number> {
    return this.delete(`/names/${id}`, undefined, {
      headers: { authorization },
    })
  }
}

export default BackendAPI

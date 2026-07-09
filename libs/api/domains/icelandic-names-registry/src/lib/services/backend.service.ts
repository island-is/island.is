import { Inject, Injectable } from '@nestjs/common'
import type { IcelandicNamesRegistryOptions } from '@island.is/icelandic-names-registry-types'
import {
  IcelandicName,
  ICELANDIC_NAMES_REGISTRY_OPTIONS,
} from '@island.is/icelandic-names-registry-types'

import { CreateIcelandicNameInput } from '../dto/icelandic-name.input.dto'

@Injectable()
class BackendAPI {
  private readonly baseURL: string

  constructor(
    @Inject(ICELANDIC_NAMES_REGISTRY_OPTIONS)
    private readonly options: IcelandicNamesRegistryOptions,
  ) {
    this.baseURL = `${this.options.backendUrl}/api/icelandic-names-registry`
  }

  private async request<TResult>(
    path: string,
    init?: RequestInit,
  ): Promise<TResult> {
    const res = await fetch(`${this.baseURL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    })

    const body = await res.text()
    let data: unknown
    try {
      data = body ? JSON.parse(body) : undefined
    } catch {
      data = body
    }

    if (!res.ok) {
      throw Object.assign(
        new Error(`Request to ${path} failed with status ${res.status}`),
        { extensions: { response: { status: res.status, body: data } } },
      )
    }

    return data as TResult
  }

  getAll(): Promise<IcelandicName[]> {
    return this.request(`/names`)
  }

  getById(id: number): Promise<IcelandicName> {
    return this.request(`/names/${id}`)
  }

  getByInitialLetter(initialLetter: string): Promise<IcelandicName[]> {
    return this.request(`/names/initial-letter/${initialLetter}`)
  }

  getBySearch(q: string): Promise<IcelandicName[]> {
    return this.request(`/names/search/${q}`)
  }

  updateById(
    id: number,
    body: CreateIcelandicNameInput,
    authorization: string,
  ): Promise<IcelandicName> {
    return this.request(`/names/${id}`, {
      method: 'PATCH',
      headers: { authorization },
      body: JSON.stringify(body),
    })
  }

  create(
    body: CreateIcelandicNameInput,
    authorization: string,
  ): Promise<IcelandicName> {
    return this.request(`/names/`, {
      method: 'POST',
      headers: { authorization },
      body: JSON.stringify(body),
    })
  }

  deleteById(id: number, authorization: string): Promise<number> {
    return this.request(`/names/${id}`, {
      method: 'DELETE',
      headers: { authorization },
    })
  }
}

export default BackendAPI

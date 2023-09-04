//TODO remove unused?

import { Request } from 'express'
import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { Injectable } from '@nestjs/common'
import { ProblemError } from '@island.is/nest/problem'
import { environment } from '../../environments'

@Injectable()
export class BackendApi extends DataSource<{ req: Request }> {
  private headers!: { [key: string]: string }

  initialize(config: DataSourceConfig<{ req: Request }>): void {
    this.headers = {
      'Content-Type': 'application/json',
      authorization: config.context.req.headers.authorization as string,
      cookie: config.context.req.headers.cookie as string,
    }
  }

  private async callBackend<TResult>(
    route: string,
    options: RequestInit,
  ): Promise<TResult> {
    return fetch(`${environment.backend.url}/api/${route}`, options).then(
      async (res) => {
        const response = await res.json()

        if (res.ok) {
          return response
        }

        throw new ProblemError(response)
      },
    )
  }

  private get<TResult>(route: string): Promise<TResult> {
    return this.callBackend<TResult>(route, { headers: this.headers })
  }

  private post<TBody, TResult>(route: string, body?: TBody): Promise<TResult> {
    return this.callBackend<TResult>(route, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: this.headers,
    })
  }

  private patch<TBody, TResult>(route: string, body: TBody): Promise<TResult> {
    return this.callBackend<TResult>(route, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: this.headers,
    })
  }

  private delete<TResult>(route: string): Promise<TResult> {
    return this.callBackend<TResult>(route, {
      method: 'DELETE',
      headers: this.headers,
    })
  }
}

export default BackendApi

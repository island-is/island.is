import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'

import { Application } from '@island.is/gjafakort/types'

import { environment } from '../environments'

class ApplicationAPI extends RESTDataSource {
  baseURL = `${environment.applicationUrl}/`

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
  }

  async createApplication<T extends Application>({
    applicationType,
    issuerSSN,
    authorSSN,
    state,
    data,
  }: {
    applicationType: T['type']
    issuerSSN: T['issuerSSN']
    authorSSN: string
    state: T['state']
    data: T['data']
  }): Promise<T> {
    const res = await this.post(`issuers/${issuerSSN}/applications`, {
      authorSSN,
      type: applicationType,
      state,
      data,
    })

    return res.application
  }

  async getApplicationByType<T extends Application>(
    applicationType: T['type'],
    issuerSSN: T['issuerSSN'],
  ): Promise<T> {
    try {
      const res = await this.get(
        `issuers/${issuerSSN}/applications/${applicationType}`,
      )
      return res.application
    } catch {
      return null
    }
  }

  async getApplications<T extends Application>(
    applicationType: T['type'],
  ): Promise<[T]> {
    const res = await this.get(`applications?type=${applicationType}`)
    return res.applications
  }

  async getApplicationCount<T extends Application>(
    applicationType: T['type'],
  ): Promise<number> {
    const res = await this.get(
      `applications?type=${applicationType}&count=true`,
    )
    return res.count
  }

  async getApplication<T extends Application>(id: string): Promise<T> {
    try {
      const res = await this.get(`applications/${id}`)

      return res.application
    } catch {
      return null
    }
  }

  async updateApplication<T extends Application>({
    id,
    state,
    authorSSN,
    data,
  }: {
    id: T['id']
    authorSSN: string
    state?: Application['state']
    data?: object
  }): Promise<T> {
    const res = await this.put(`applications/${id}`, { state, authorSSN, data })

    return res.application
  }
}

export default ApplicationAPI

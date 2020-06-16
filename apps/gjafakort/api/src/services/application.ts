import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'

import { environment } from '../environments'

interface Application {
  type: string
  data: object
}

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
    issuerSSN: string
    authorSSN: string
    state: string
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
    issuerSSN: string,
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

  async getApplication<T extends Application>(id: string): Promise<T> {
    try {
      const res = await this.get(`applications/${id}`)

      return res.application
    } catch {
      return null
    }
  }

  async updateApplication<T extends Application>(
    id: string,
    state: 'manual-approved' | 'rejected',
    authorSSN: string,
  ): Promise<T> {
    const res = await this.put(`applications/${id}`, { state, authorSSN })

    return res.application
  }
}

export default ApplicationAPI

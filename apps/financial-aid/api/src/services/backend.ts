import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'

import { Injectable } from '@nestjs/common'

import {
  Application,
  Municipality,
  UpdateApplication,
  CreateApplication,
  GetSignedUrl,
  SignedUrl,
  ApplicationEvent,
  CreateApplicationEvent,
  ApplicationFilters,
  CreateFilesResponse,
} from '@island.is/financial-aid/shared/lib'

import { environment } from '../environments'
import { CreateApplicationFilesInput } from '../app/modules/file/dto'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backend.url}/api`

  willSendRequest(req: RequestOptions) {
    req.headers.set('authorization', this.context.req.headers.authorization)
    req.headers.set('cookie', this.context.req.headers.cookie)
  }

  getApplications(): Promise<Application[]> {
    return this.get('applications')
  }

  getApplication(id: string): Promise<Application> {
    return this.get(`applications/${id}`)
  }

  getApplicationFilters(): Promise<ApplicationFilters> {
    return this.get('applicationFilters')
  }

  getMunicipality(id: string): Promise<Municipality> {
    return this.get(`municipality/${id}`)
  }

  createApplication(
    createApplication: CreateApplication,
  ): Promise<Application> {
    return this.post('application', createApplication)
  }

  updateApplication(
    id: string,
    updateApplication: UpdateApplication,
  ): Promise<Application> {
    return this.put(`applications/${id}`, updateApplication)
  }

  updateApplicationTable(
    id: string,
    updateApplication: UpdateApplication,
  ): Promise<Application[]> {
    return this.put(`applicationsTable/${id}`, updateApplication)
  }

  getSignedUrl(getSignedUrl: GetSignedUrl): Promise<SignedUrl> {
    return this.post('file/url', getSignedUrl)
  }

  getSignedUrlForId(id: string): Promise<SignedUrl> {
    return this.get(`file/url/${id}`)
  }

  getApplicationEvents(id: string): Promise<ApplicationEvent[]> {
    return this.get(`applicationEvents/${id}`)
  }

  createApplicationEvent(
    createApplicationEvent: CreateApplicationEvent,
  ): Promise<Application> {
    return this.post('applicationEvent', createApplicationEvent)
  }

  createApplicationFiles(
    createApplicationFiles: CreateApplicationFilesInput,
  ): Promise<CreateFilesResponse> {
    return this.post('file', createApplicationFiles)
  }
}

export default BackendAPI

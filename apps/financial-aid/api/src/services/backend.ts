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
  apiBasePath,
  ApplicationStateUrl,
  UpdateApplicationTableResponseType,
  UpdateApplicationResponseType,
} from '@island.is/financial-aid/shared/lib'

import { environment } from '../environments'
import { CreateApplicationFilesInput } from '../app/modules/file/dto'
import { CurrentApplicationModel } from '../app/modules/application'
import { StaffModel } from '../app/modules/staff'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backend.url}/${apiBasePath}`

  willSendRequest(req: RequestOptions) {
    req.headers.set('authorization', this.context.req.headers.authorization)
    req.headers.set('cookie', this.context.req.headers.cookie)
  }

  getApplications(stateUrl: ApplicationStateUrl): Promise<Application[]> {
    return this.get(`allApplications/${stateUrl}`)
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
    stateUrl: ApplicationStateUrl,
    updateApplication: UpdateApplication,
  ): Promise<UpdateApplicationTableResponseType> {
    return this.put(`applications/${id}/${stateUrl}`, updateApplication)
  }

  updateApplicationRes(
    id: string,
    updateApplication: UpdateApplication,
  ): Promise<UpdateApplicationResponseType> {
    return this.put(`updateApplication/${id}`, updateApplication)
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

  getCurrentApplication(nationalId: string): Promise<CurrentApplicationModel> {
    return this.get(`currentApplication/${nationalId}`)
  }

  getStaff(nationalId: string): Promise<StaffModel> {
    return this.get(`staff/${nationalId}`)
  }
}

export default BackendAPI

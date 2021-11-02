import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'

import { Injectable } from '@nestjs/common'

import {
  Application,
  Municipality,
  UpdateApplication,
  CreateApplication,
  GetSignedUrl,
  SignedUrl,
  CreateApplicationEvent,
  ApplicationFilters,
  CreateFilesResponse,
  apiBasePath,
  ApplicationStateUrl,
  UpdateApplicationTableResponseType,
} from '@island.is/financial-aid/shared/lib'

import { environment } from '../environments'
import { CreateApplicationFilesInput } from '../app/modules/file/dto'
import { StaffModel } from '../app/modules/staff'
import { HasSpouseAppliedModel } from '../app/modules/user/HasSpouseApplied.model'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backend.url}/${apiBasePath}`

  willSendRequest(req: RequestOptions) {
    req.headers.set('authorization', this.context.req.headers.authorization)
    req.headers.set('cookie', this.context.req.headers.cookie)
  }

  getApplications(stateUrl: ApplicationStateUrl): Promise<Application[]> {
    return this.get(`application/state/${stateUrl}`)
  }

  getApplication(id: string): Promise<Application> {
    return this.get(`application/id/${id}`)
  }

  getApplicationFilters(): Promise<ApplicationFilters> {
    return this.get('application/filters')
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
    return this.put(`application/id/${id}`, updateApplication)
  }

  updateApplicationTable(
    id: string,
    stateUrl: ApplicationStateUrl,
    updateApplication: UpdateApplication,
  ): Promise<UpdateApplicationTableResponseType> {
    return this.put(`application/${id}/${stateUrl}`, updateApplication)
  }

  getSignedUrl(getSignedUrl: GetSignedUrl): Promise<SignedUrl> {
    return this.post('file/url', getSignedUrl)
  }

  getSignedUrlForId(id: string): Promise<SignedUrl> {
    return this.get(`file/url/${id}`)
  }

  createApplicationEvent(
    createApplicationEvent: CreateApplicationEvent,
  ): Promise<Application> {
    return this.post('application/event', createApplicationEvent)
  }

  createApplicationFiles(
    createApplicationFiles: CreateApplicationFilesInput,
  ): Promise<CreateFilesResponse> {
    return this.post('file', createApplicationFiles)
  }

  getCurrentApplication(nationalId: string): Promise<string | undefined> {
    return this.get(`application/nationalId/${nationalId}`)
  }

  isSpouse(spouseNationalId: string): Promise<HasSpouseAppliedModel> {
    return this.get(`application/spouse/${spouseNationalId}`)
  }

  getStaff(nationalId: string): Promise<StaffModel> {
    return this.get(`staff/${nationalId}`)
  }
}

export default BackendAPI

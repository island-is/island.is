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
  UpdateStaff,
  UpdateMunicipalityActivity,
  Staff,
  CreateStaff,
  CreateMunicipality,
  ApplicationPagination,
  ApiKeysForMunicipality,
} from '@island.is/financial-aid/shared/lib'

import { environment } from '../environments'
import { CreateApplicationFilesInput } from '../app/modules/file/dto'
import { CreateStaffInput } from '../app/modules/staff'
import { SpouseModel } from '../app/modules/user'
import { UpdateMunicipalityInput } from '../app/modules/municipality/dto'
import {
  DirectTaxPaymentsResponse,
  PersonalTaxReturnResponse,
} from '../app/modules/personalTaxReturn/models'
import { FilterApplicationsInput } from '../app/modules/application/dto'

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

  searchForApplication(nationalId: string): Promise<Application[]> {
    return this.get(`application/find/${nationalId}`)
  }

  getApplicationFilters(): Promise<ApplicationFilters> {
    return this.get('application/filters')
  }

  getMunicipality(id: string): Promise<Municipality> {
    return this.get(`municipality/id/${id}`)
  }

  getMunicipalitiesById(): Promise<Municipality[]> {
    return this.get('municipality/ids')
  }

  getMunicipalities(): Promise<Municipality[]> {
    return this.get(`municipality`)
  }

  getApiKeys(): Promise<ApiKeysForMunicipality[]> {
    return this.get(`apiKeys`)
  }

  createMunicipality(
    createMunicipality: CreateMunicipality,
    createAdmin?: CreateStaff,
  ): Promise<Municipality> {
    return this.post('municipality', {
      municipalityInput: createMunicipality,
      adminInput: createAdmin,
    })
  }

  updateMunicipality(
    updateMunicipality: UpdateMunicipalityInput,
  ): Promise<Municipality[]> {
    return this.put('municipality', updateMunicipality)
  }

  updateMunicipalityActivity(
    id: string,
    updateMunicipality: UpdateMunicipalityActivity,
  ): Promise<Municipality> {
    return this.put(`municipality/activity/${id}`, updateMunicipality)
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

  getSignedUrlForAllFiles(applicationId: string): Promise<SignedUrl[]> {
    return this.get(`file/${applicationId}`)
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

  getCurrentApplicationId(): Promise<string | undefined> {
    return this.get('application/nationalId')
  }

  getSpouse(): Promise<SpouseModel> {
    return this.get('application/spouse')
  }

  getStaff(): Promise<Staff> {
    return this.get('staff/nationalId')
  }

  getStaffById(id: string): Promise<Staff> {
    return this.get(`staff/id/${id}`)
  }

  getAdminUsers(municipalityId: string): Promise<Staff[]> {
    return this.get(`staff/users/${municipalityId}`)
  }
  getAllAdminUsers(municipalityId: string): Promise<Staff[]> {
    return this.get(`staff/allAdminUsers/${municipalityId}`)
  }

  getSupervisors(): Promise<Staff[]> {
    return this.get('staff/supervisors')
  }

  getAdmins(): Promise<Staff[]> {
    return this.get('staff/admins')
  }

  updateStaff(id: string, updateStaff: UpdateStaff): Promise<Staff> {
    return this.put(`staff/id/${id}`, updateStaff)
  }

  getStaffForMunicipality(): Promise<Staff[]> {
    return this.get('staff/municipality')
  }

  createStaff(createStaff: CreateStaffInput): Promise<Staff> {
    return this.post('staff', createStaff)
  }

  getNumberOfStaffForMunicipality(municipalityId: string): Promise<number> {
    return this.get(`staff/municipality/${municipalityId}`)
  }

  getPersonalTaxReturn(id: string): Promise<PersonalTaxReturnResponse> {
    return this.get(`personalTaxReturn/id/${id}`)
  }

  getDirectTaxPayments(): Promise<DirectTaxPaymentsResponse> {
    return this.get('personalTaxReturn/directTaxPayments')
  }

  getFilteredApplications(
    filters: FilterApplicationsInput,
  ): Promise<ApplicationPagination> {
    return this.post('application/filter', filters)
  }
}

export default BackendAPI

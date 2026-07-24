import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest'

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
  CreateMunicipalityApiUser,
  UpdatedApiKeysForMunicipality,
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
import { DeleteApiKeyResponse } from '../app/modules/apiKeys/models'

interface RequestHeaders {
  authorization?: string
  cookie?: string
}

// Constructed per request in the GraphQL context factory (see app.module.ts),
// which is where the incoming request's auth headers come from.
class BackendAPI extends RESTDataSource {
  // Paths are resolved with `new URL(path, baseURL)`, so the trailing slash
  // is load-bearing.
  override baseURL = `${environment.backend.url}/${apiBasePath}/`

  constructor(private readonly incomingHeaders: RequestHeaders) {
    super()
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    const { authorization, cookie } = this.incomingHeaders
    if (authorization) {
      request.headers['authorization'] = authorization
    }
    if (cookie) {
      request.headers['cookie'] = cookie
    }
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

  updateApiKey(
    input: UpdatedApiKeysForMunicipality,
  ): Promise<ApiKeysForMunicipality> {
    return this.put(`apiKeys/${input.id}`, { body: { name: input.name } })
  }

  deleteApiKey(id: string): Promise<DeleteApiKeyResponse> {
    return this.delete(`apiKeys/${id}`)
  }

  createApiKey(
    createApiKey: CreateMunicipalityApiUser,
  ): Promise<ApiKeysForMunicipality> {
    return this.post('apiKeys', { body: createApiKey })
  }

  createMunicipality(
    createMunicipality: CreateMunicipality,
    createAdmin?: CreateStaff,
  ): Promise<Municipality> {
    return this.post('municipality', {
      body: {
        municipalityInput: createMunicipality,
        adminInput: createAdmin,
      },
    })
  }

  updateMunicipality(
    updateMunicipality: UpdateMunicipalityInput,
  ): Promise<Municipality[]> {
    return this.put('municipality', { body: updateMunicipality })
  }

  updateMunicipalityActivity(
    id: string,
    updateMunicipality: UpdateMunicipalityActivity,
  ): Promise<Municipality> {
    return this.put(`municipality/activity/${id}`, {
      body: updateMunicipality,
    })
  }

  createApplication(
    createApplication: CreateApplication,
  ): Promise<Application> {
    return this.post('application', { body: createApplication })
  }

  updateApplication(
    id: string,
    updateApplication: UpdateApplication,
  ): Promise<Application> {
    return this.put(`application/id/${id}`, { body: updateApplication })
  }

  updateApplicationTable(
    id: string,
    stateUrl: ApplicationStateUrl,
    updateApplication: UpdateApplication,
  ): Promise<UpdateApplicationTableResponseType> {
    return this.put(`application/${id}/${stateUrl}`, {
      body: updateApplication,
    })
  }

  getSignedUrl(getSignedUrl: GetSignedUrl): Promise<SignedUrl> {
    return this.post('file/url', { body: getSignedUrl })
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
    return this.post('application/event', { body: createApplicationEvent })
  }

  createApplicationFiles(
    createApplicationFiles: CreateApplicationFilesInput,
  ): Promise<CreateFilesResponse> {
    return this.post('file', { body: createApplicationFiles })
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
    return this.put(`staff/id/${id}`, { body: updateStaff })
  }

  getStaffForMunicipality(): Promise<Staff[]> {
    return this.get('staff/municipality')
  }

  createStaff(createStaff: CreateStaffInput): Promise<Staff> {
    return this.post('staff', { body: createStaff })
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
    return this.post('application/filter', { body: filters })
  }
}

export default BackendAPI

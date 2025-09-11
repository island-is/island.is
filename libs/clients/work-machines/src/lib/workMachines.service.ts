import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { isDefined } from '@island.is/shared/utils'
import { Injectable } from '@nestjs/common'
import {
  ApiLicenseGetRequest,
  ApiMachineLicenseTeachingApplicationPostRequest,
  ApiMachineModelsGetRequest,
  ApiMachineOwnerChangeOwnerchangeIdDeleteRequest,
  ApiMachineParentCategoriesTypeModelGetRequest,
  ApiMachineStatusChangePostRequest,
  ApiMachineSubCategoriesGetRequest,
  ApiMachineTypesTypeByRegistrationNumberGetRequest,
  ApiMachinesGetRequest,
  ApiMachinesPostRequest,
  ApiTechnicalInfoInputsGetRequest,
  ExcelRequest,
  LicenseApi,
  MachineCategoryApi,
  MachineInspectionRequestCreateDto,
  MachineLicenseTeachingApplicationApi,
  MachineModelDto,
  MachineModelsApi,
  MachineOwnerChangeApi,
  MachineParentCategoriesApi,
  MachineParentCategoryDetailsDto,
  MachineParentCategoryDto,
  MachineRequestInspectionApi,
  MachineStatusChangeApi,
  MachineStreetRegistrationApi,
  MachineStreetRegistrationCreateDto,
  MachineSubCategoriesApi,
  MachineSubCategoryDto,
  MachineSupervisorChangeApi,
  MachineTypeDto,
  MachineTypesApi,
  MachinesApi,
  MachinesDocumentApi,
  TechInfoItemDto,
  TechnicalInfoApi,
} from '../../gen/fetch'
import {
  MachineDto,
  ChangeMachineOwner,
  ConfirmOwnerChange,
  SupervisorChange,
  MachinesWithTotalCount,
} from './workMachines.types'
import {
  apiChangeMachineOwnerToApiRequest,
  apiChangeSupervisorToApiRequest,
  confirmChangeToApiRequest,
} from './workMachines.utils'
import { CustomMachineApi } from './providers'
import { handle404 } from '@island.is/clients/middlewares'
import { WorkMachineResponseDto } from './dtos/workMachinesResponse.dto'
import {
  WorkMachinesCollectionItem,
  mapWorkMachine,
  mapWorkMachinesCollectionItem,
} from './dtos/workMachineItem.dto'
import { mapLinkDto } from './dtos/link.dto'
import { mapLabelDto } from './dtos/label.dto'
import { mapPaginationDto } from './dtos/pagination.dto'
import {
  GetMachineByIdInput,
  GetMachineByRegNumberInput,
  isIdInput,
} from './inputs/getWorkMachineInput.dto'

@Injectable()
export class WorkMachinesClientService {
  constructor(
    private readonly machinesApi: MachinesApi,
    private readonly machineApi: CustomMachineApi,
    private readonly docApi: MachinesDocumentApi,
    private readonly machineOwnerChangeApi: MachineOwnerChangeApi,
    private readonly machineCategoryApi: MachineCategoryApi,
    private readonly machineSupervisorChangeApi: MachineSupervisorChangeApi,
    private readonly machineStatusApi: MachineStatusChangeApi,
    private readonly machineStreetApi: MachineStreetRegistrationApi,
    private readonly machineRequestInspection: MachineRequestInspectionApi,
    private readonly machineTypesApi: MachineTypesApi,
    private readonly machineModelsApi: MachineModelsApi,
    private readonly machineParentCategoriesApi: MachineParentCategoriesApi,
    private readonly machineSubCategoriesApi: MachineSubCategoriesApi,
    private readonly technicalInfoApi: TechnicalInfoApi,
    private readonly licenseApi: LicenseApi,
    private readonly machineLicenseTeachingApplicationApi: MachineLicenseTeachingApplicationApi,
  ) {}

  private machinesApiWithAuth = (user: User) =>
    this.machinesApi.withMiddleware(new AuthMiddleware(user as Auth))

  private machineApiWithAuth = (user: User) =>
    this.machineApi.withMiddleware(new AuthMiddleware(user as Auth))

  private machineOwnerChangeApiWithAuth(auth: Auth) {
    return this.machineOwnerChangeApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineCategoryApiWithAuth(auth: Auth) {
    return this.machineCategoryApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineSupervisorChangeApiWithAuth(auth: Auth) {
    return this.machineSupervisorChangeApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  private machineStatusApiWithAuth(auth: Auth) {
    return this.machineStatusApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineStreetApiWithAuth(auth: Auth) {
    return this.machineStreetApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineRequestInspectionApiWithAuth(auth: Auth) {
    return this.machineRequestInspection.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  private machineTypesApiWithAuth(auth: Auth) {
    return this.machineTypesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineModelsApiWithAuth(auth: Auth) {
    return this.machineModelsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineParentCategoriesApiWithAuth(auth: Auth) {
    return this.machineParentCategoriesApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  private machineSubCategoriesApiWithAuth(auth: Auth) {
    return this.machineSubCategoriesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private technicalReadOnlyApiWithAuth(auth: Auth) {
    return this.technicalInfoApi.withMiddleware(new AuthMiddleware(auth))
  }

  private licenseApiWithAuth(auth: Auth) {
    return this.licenseApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineLicenseTeachingApplicationApiWithAuth(auth: Auth) {
    return this.machineLicenseTeachingApplicationApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  getWorkMachines = async (
    user: User,
    input?: ApiMachinesGetRequest,
  ): Promise<WorkMachineResponseDto | null> => {
    const data = await this.machinesApiWithAuth(user)
      .apiMachinesGet(input ?? {})
      .catch(handle404)

    if (!data) {
      return null
    }

    return {
      machines:
        data.value
          ?.map((v) => mapWorkMachinesCollectionItem(v))
          .filter(isDefined) ?? [],
      links: data.links?.map((l) => mapLinkDto(l)).filter(isDefined) ?? [],
      labels: data.labels?.map((l) => mapLabelDto(l)).filter(isDefined) ?? [],
      pagination: mapPaginationDto(data.pagination) ?? undefined,
    }
  }

  getWorkMachine = async (
    user: User,
    input: GetMachineByIdInput | GetMachineByRegNumberInput,
  ): Promise<WorkMachinesCollectionItem | null> => {
    if (isIdInput(input)) {
      return this.getWorkMachineById(user, input)
    }

    const defaultOptions = {
      onlyShowOwnedMachines: true,
      searchQuery: input.regNumber,
    }
    const result = await this.machinesApiWithAuth(user).apiMachinesGet({
      ...defaultOptions,
      searchQuery: input.regNumber,
    })

    const machineId = result?.value?.[0]?.id ?? undefined

    if (!machineId) {
      return null
    }

    return this.getWorkMachineById(user, { id: machineId, ...input })
  }

  getWorkMachineById = async (
    user: User,
    input: GetMachineByIdInput,
  ): Promise<WorkMachinesCollectionItem | null> => {
    const data = await this.machineApiWithAuth(user)
      .getMachine(input)
      .catch(handle404)

    if (!data) {
      return null
    }

    const workMachine = mapWorkMachine(data)

    if (!workMachine) {
      return null
    }

    return {
      ...workMachine,
      links: data.links?.map((l) => mapLinkDto(l)).filter(isDefined) ?? [],
      labels: data.labels?.map((l) => mapLabelDto(l)).filter(isDefined) ?? [],
    }
  }

  getDocuments = (user: User, input: ExcelRequest): Promise<Blob> =>
    this.docApi.withMiddleware(new AuthMiddleware(user as Auth)).excel(input)

  async getMachines(
    auth: User,
    parameters?: ApiMachinesGetRequest,
  ): Promise<MachinesWithTotalCount> {
    const defaultOptions = {
      onlyShowOwnedMachines: true,
      pageSize: 20,
      pageNumber: 1,
    }

    const result = await this.machinesApiWithAuth(auth).apiMachinesGet({
      ...defaultOptions,
      ...parameters,
    })
    return {
      machines:
        result?.value?.map((machine) => {
          return {
            id: machine.id,
            type: machine.type || '',
            category: machine?.category || '',
            regNumber: machine?.registrationNumber || '',
            status: machine?.status || '',
            paymentRequiredForOwnerChange:
              machine?.paymentRequiredForOwnerChange ?? true,
          }
        }) || [],
      totalCount: result?.pagination?.totalCount || 0,
    }
  }

  async getMachineByRegno(
    auth: User,
    regNumber: string,
    rel: string,
    parameters?: ApiMachinesGetRequest,
  ): Promise<MachineDto | null> {
    const defaultOptions = {
      onlyShowOwnedMachines: true,
      searchQuery: regNumber,
    }
    const result = await this.machinesApiWithAuth(auth).apiMachinesGet({
      ...defaultOptions,
      ...parameters,
    })

    const machineId = result?.value?.[0]?.id ?? undefined

    if (!machineId) {
      return null
    }

    return await this.getMachineDetail(auth, machineId, rel)
  }

  async getMachineDetail(
    auth: User,
    id: string,
    rel: string,
  ): Promise<MachineDto> {
    const result = await this.machineApiWithAuth(auth).getMachine({ id })
    const [type, ...subType] = result.type?.split(' ') || ''
    return {
      id: result.id,
      ownerNumber: result?.ownerNumber || '',
      plate: result?.licensePlateNumber || '',
      subType: subType.join(' '),
      type: type,
      category: result?.category || '',
      regNumber: result?.registrationNumber || '',
      supervisorName: result?.supervisorName || '',
      status: result?.status || '',
      disabled: !result?.links?.some((link) => link?.rel === rel),
      paymentRequiredForOwnerChange:
        result?.paymentRequiredForOwnerChange ?? true,
    }
  }

  async isPaymentRequired(auth: Auth, regNumber: string) {
    const result = await this.machineCategoryApiWithAuth(
      auth,
    ).apiMachineCategoryGet({ registrationNumber: regNumber })

    return result.paymentRequiredForOwnerChange || false
  }

  async initiateOwnerChangeProcess(
    auth: Auth,
    ownerChange: ChangeMachineOwner,
  ) {
    const input = apiChangeMachineOwnerToApiRequest(ownerChange)

    await this.machineOwnerChangeApiWithAuth(auth).apiMachineOwnerChangePost(
      input,
    )
  }

  async confirmOwnerChange(auth: Auth, confirmChange: ConfirmOwnerChange) {
    const input = confirmChangeToApiRequest(
      confirmChange,
      auth.nationalId || '',
    )

    await this.machineOwnerChangeApiWithAuth(auth).apiMachineOwnerChangePut(
      input,
    )
  }

  async deleteOwnerChange(
    auth: Auth,
    deleteChange: ApiMachineOwnerChangeOwnerchangeIdDeleteRequest,
  ) {
    await this.machineOwnerChangeApiWithAuth(
      auth,
    ).apiMachineOwnerChangeOwnerchangeIdDelete(deleteChange)
  }

  async changeMachineSupervisor(
    auth: Auth,
    supervisorChange: SupervisorChange,
  ) {
    const input = apiChangeSupervisorToApiRequest(supervisorChange)
    await this.machineSupervisorChangeApiWithAuth(
      auth,
    ).apiMachineSupervisorChangePost(input)
  }

  async deregisterMachine(
    auth: Auth,
    deregisterMachine: ApiMachineStatusChangePostRequest,
  ) {
    await this.machineStatusApiWithAuth(auth).apiMachineStatusChangePost(
      deregisterMachine,
    )
  }

  async streetRegistration(
    auth: Auth,
    streetRegistration: MachineStreetRegistrationCreateDto,
  ) {
    await this.machineStreetApiWithAuth(auth).apiMachineStreetRegistrationPost({
      machineStreetRegistrationCreateDto: streetRegistration,
    })
  }

  async requestInspection(
    auth: Auth,
    requestInspection: MachineInspectionRequestCreateDto,
  ) {
    await this.machineRequestInspectionApiWithAuth(
      auth,
    ).apiMachineRequestInspectionPost({
      machineInspectionRequestCreateDto: requestInspection,
    })
  }

  async mustInspectBeforeRegistration(auth: Auth) {
    return await this.machineStreetApiWithAuth(
      auth,
    ).apiMachineStreetRegistrationMustInspectBeforeRegistrationGet({})
  }

  async getAvailableRegistrationTypes(auth: Auth) {
    return await this.machineStreetApiWithAuth(
      auth,
    ).apiMachineStreetRegistrationMayStreetRegisterGet({})
  }

  async getMachineTypes(auth: Auth): Promise<MachineTypeDto[]> {
    return await this.machineTypesApiWithAuth(auth).apiMachineTypesGet({})
  }

  async getMachineModels(
    auth: Auth,
    requestParameters: ApiMachineModelsGetRequest,
  ): Promise<MachineModelDto[]> {
    return await this.machineModelsApiWithAuth(auth).apiMachineModelsGet(
      requestParameters,
    )
  }

  async getMachineParentCategoriesTypeModel(
    auth: Auth,
    requestParameters: ApiMachineParentCategoriesTypeModelGetRequest,
  ): Promise<MachineParentCategoryDetailsDto[]> {
    return await this.machineParentCategoriesApiWithAuth(
      auth,
    ).apiMachineParentCategoriesTypeModelGet(requestParameters)
  }

  async getMachineParentCategories(
    auth: Auth,
  ): Promise<MachineParentCategoryDto[]> {
    return await this.machineParentCategoriesApiWithAuth(
      auth,
    ).apiMachineParentCategoriesGet({})
  }

  async getMachineSubCategories(
    auth: Auth,
    requestParameters: ApiMachineSubCategoriesGetRequest,
  ): Promise<MachineSubCategoryDto[]> {
    return await this.machineSubCategoriesApiWithAuth(
      auth,
    ).apiMachineSubCategoriesGet(requestParameters)
  }

  async getTechnicalInfoInputs(
    auth: Auth,
    requestParameters: ApiTechnicalInfoInputsGetRequest,
  ): Promise<TechInfoItemDto[]> {
    return await this.technicalReadOnlyApiWithAuth(
      auth,
    ).apiTechnicalInfoInputsGet(requestParameters)
  }

  async addNewMachine(auth: User, requestParameters: ApiMachinesPostRequest) {
    return await this.machinesApiWithAuth(auth).apiMachinesPost(
      requestParameters,
    )
  }

  async getLicenses(auth: Auth, requestParameters: ApiLicenseGetRequest) {
    return await this.licenseApiWithAuth(auth).apiLicenseGet(requestParameters)
  }

  async getTypeByRegistrationNumber(
    auth: Auth,
    requestParameters: ApiMachineTypesTypeByRegistrationNumberGetRequest,
  ) {
    return await this.machineTypesApiWithAuth(
      auth,
    ).apiMachineTypesTypeByRegistrationNumberGet(requestParameters)
  }

  async machineLicenseTeachingApplication(
    auth: Auth,
    requestParameters: ApiMachineLicenseTeachingApplicationPostRequest,
  ) {
    return await this.machineLicenseTeachingApplicationApiWithAuth(
      auth,
    ).apiMachineLicenseTeachingApplicationPost(requestParameters)
  }
}

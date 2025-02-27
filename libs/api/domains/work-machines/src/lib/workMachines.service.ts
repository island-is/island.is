import {
  MachineModelDto,
  MachineParentCategoryDetailsDto,
  MachineSubCategoryDto,
  MachineTypeDto,
  TechInfoItemDto,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
import { isDefined } from '@island.is/shared/utils'
import { User } from '@island.is/auth-nest-tools'
import {
  WorkMachine,
  PaginatedCollectionResponse,
} from './models/getWorkMachines'
import { Inject, Injectable } from '@nestjs/common'
import { Action, ExternalLink } from './workMachines.types'
import { GetWorkMachineCollectionInput } from './dto/getWorkMachineCollection.input'
import { GetWorkMachineInput } from './dto/getWorkMachine.input'
import { GetDocumentsInput } from './dto/getDocuments.input'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { MachineDto } from '@island.is/clients/work-machines'
import { GetMachineParentCategoryByTypeAndModelInput } from './dto/getMachineParentCategoryByTypeAndModel.input'
import isValid from 'date-fns/isValid'

@Injectable()
export class WorkMachinesService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly machineService: WorkMachinesClientService,
  ) {}

  private mapRelToAction = (rel?: string) => {
    switch (rel) {
      case 'requestInspection':
        return Action.REQUEST_INSPECTION
      case 'changeStatus':
        return Action.CHANGE_STATUS
      case 'ownerChange':
        return Action.OWNER_CHANGE
      case 'supervisorChange':
        return Action.SUPERVISOR_CHANGE
      case 'registerForTraffic':
        return Action.REGISTER_FOR_TRAFFIC
      default:
        return null
    }
  }

  private mapRelToCollectionLink = (rel?: string) => {
    switch (rel) {
      case 'self':
        return ExternalLink.SELF
      case 'nextPage':
        return ExternalLink.NEXT_PAGE
      case 'excel':
        return ExternalLink.EXCEL
      case 'csv':
        return ExternalLink.CSV
      default:
        return null
    }
  }

  async getWorkMachines(
    user: User,
    input: GetWorkMachineCollectionInput,
  ): Promise<PaginatedCollectionResponse | null> {
    const data = await this.machineService.getWorkMachines(user, input)

    if (!data) {
      return null
    }

    if (!data.links || !data.pagination || !data.labels) {
      this.logger.warn(
        'No links, labels or pagination data in work machines collection response',
      )
    }

    const workMachines: Array<WorkMachine> =
      data.value
        ?.map((v) => {
          const inspectionDate = v.dateLastInspection
            ? new Date(v.dateLastInspection)
            : undefined
          return {
            ...v,
            dateLastInspection: isValid(inspectionDate)
              ? inspectionDate
              : undefined,
            ownerName: v.owner,
            supervisorName: v.supervisor,
          }
        })
        .filter(isDefined) ?? []

    const links = data.links?.length
      ? data.links.map((l) => {
          return {
            ...l,
            rel: this.mapRelToCollectionLink(l.rel ?? ''),
          }
        })
      : null

    return {
      data: workMachines,
      links,
      labels: data.labels,
      totalCount: data.pagination?.totalCount ?? 0,
      pageInfo: {
        hasNextPage:
          data.pagination?.currentPage && data.pagination.totalPages
            ? data.pagination.currentPage < data.pagination.totalPages
            : false,
      },
    }
  }

  async getWorkMachineById(
    user: User,
    input: GetWorkMachineInput,
  ): Promise<WorkMachine | null> {
    const data = await this.machineService.getWorkMachineById(user, input)

    if (!data) {
      return null
    }

    if (!data.links || !data.labels) {
      this.logger.warn('No links or label in work machine response')
    }

    const links = data.links?.length
      ? data.links.map((l) => {
          return {
            ...l,
            rel: this.mapRelToAction(l.rel ?? ''),
          }
        })
      : null

    const inspectionDate = data.dateLastInspection
      ? new Date(data.dateLastInspection)
      : undefined

    return {
      ...data,
      dateLastInspection: isValid(inspectionDate) ? inspectionDate : undefined,
      links,
    }
  }

  getDocuments = (user: User, input: GetDocumentsInput): Promise<Blob> =>
    this.machineService.getDocuments(user, input)

  async getMachineDetails(
    auth: User,
    id: string,
    rel: string,
  ): Promise<MachineDto> {
    return this.machineService.getMachineDetail(auth, id, rel)
  }

  async getMachineByRegno(
    auth: User,
    regNumber: string,
    rel: string,
  ): Promise<MachineDto> {
    return this.machineService.getMachineByRegno(auth, regNumber, rel, {
      showDeregisteredMachines: true,
    })
  }

  async isPaymentRequired(auth: User, regNumber: string): Promise<boolean> {
    return (
      (await this.machineService.isPaymentRequired(auth, regNumber)) || false
    )
  }

  async getMachineModels(auth: User, type: string): Promise<MachineModelDto[]> {
    return this.machineService.getMachineModels(auth, { tegund: type })
  }

  async getMachineParentCategoriesTypeModelGet(
    auth: User,
    input: GetMachineParentCategoryByTypeAndModelInput,
  ): Promise<MachineParentCategoryDetailsDto[]> {
    return this.machineService.getMachineParentCategoriesTypeModel(auth, {
      type: input.type,
      model: input.model,
    })
  }

  async getMachineSubCategories(
    auth: User,
    parentCategory: string,
  ): Promise<MachineSubCategoryDto[]> {
    return this.machineService.getMachineSubCategories(auth, { parentCategory })
  }

  async getTechnicalInfoInputs(
    auth: User,
    parentCategory: string,
    subCategory: string,
  ): Promise<TechInfoItemDto[]> {
    return this.machineService.getTechnicalInfoInputs(auth, {
      parentCategory,
      subCategory,
    })
  }

  async getTypeByRegistrationNumber(
    auth: User,
    registrationNumber: string,
    applicationId: string,
  ): Promise<MachineTypeDto> {
    return this.machineService.getTypeByRegistrationNumber(auth, {
      registrationNumber,
      xCorrelationID: applicationId,
    })
  }
}

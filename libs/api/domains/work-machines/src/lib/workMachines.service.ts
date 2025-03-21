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
import { PaginatedCollectionResponse } from './models/v2/workMachineCollection.model'
import { WorkMachine } from './models/v2/workMachine.model'
import { Type } from './models/v2/type.model'
import format from 'date-fns/format'
import { CollectionLink } from './models/v2/collectionLink.model'

@Injectable()
export class WorkMachinesService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly machineService: WorkMachinesClientService,
  ) {}

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
          if (!v.id || !v.registrationNumber) {
            return null
          }
          const inspectionDate = v.dateLastInspection
            ? new Date(v.dateLastInspection)
            : undefined

          let type: Type | undefined
          if (v.type) {
            const [mainType, ...subtype] = v.type.split(' ')
            type = {
              type: mainType,
              subtype: subtype.join(),
              fullType: v.type,
            }
          }

          return {
            id: v.id,
            registrationNumber: v.registrationNumber,
            type,
            owner: v.owner
              ? {
                  name: v.owner ?? undefined,
                  number: v.ownerNumber ?? undefined,
                }
              : undefined,
            supervisor: v.supervisor
              ? {
                  name: v.supervisor,
                }
              : undefined,
            status: v.status ?? undefined,
            category: v.category ?? undefined,
            subcategory: v.subCategory ?? undefined,
            licensePlateNumber: v.licensePlateNumber ?? undefined,
            paymentRequiredForOwnerChange:
              v.paymentRequiredForOwnerChange ?? undefined,
            mayStreetRegister: v.mayStreetRegister ?? undefined,
            dateLastInspection:
              inspectionDate && isValid(inspectionDate)
                ? format(inspectionDate, 'dd-MM-yyyy')
                : undefined,
          }
        })
        .filter(isDefined) ?? []

    const links: Array<CollectionLink> =
      data?.links
        ?.map((l) => {
          if (!l.href || !l.method || !l.rel) {
            return null
          }
          const rel = this.mapRelationToCollectionLink(l.rel ?? '')

          if (!rel) {
            return null
          }

          return {
            href: l.href,
            method: l.method,
            displayTitle: l.displayTitle ?? undefined,
            rel,
          }
        })
        .filter(isDefined) ?? []

    return {
      data: workMachines,
      links,
      labels: data.labels?.map((l) => ({
        columnName: l.columnName ?? undefined,
        displayTitle: l.displayTitle ?? undefined,
        tooltip: l.tooltip ?? undefined,
      })),
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
      ? data.links
          .map((l) => {
            return {
              ...l,
              rel: this.mapRelToAction(l.rel ?? ''),
            }
          })
          .filter(isDefined)
      : null

    const inspectionDate = data.dateLastInspection
      ? new Date(data.dateLastInspection)
      : undefined

    return {
      ...data,
      dateLastInspection: isValid(inspectionDate)
        ? inspectionDate?.toISOString()
        : undefined,
      links: links ?? [],
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

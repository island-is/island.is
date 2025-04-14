import {
  MachineModelDto,
  MachineParentCategoryDetailsDto,
  MachineSubCategoryDto,
  MachineTypeDto,
  TechInfoItemDto,
  WorkMachinesClientService,
  WorkMachinesCollectionItem,
} from '@island.is/clients/work-machines'
import { isDefined } from '@island.is/shared/utils'
import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import { GetWorkMachineCollectionInput } from './dto/getWorkMachineCollection.input'
import { GetWorkMachineInput } from './dto/getWorkMachine.input'
import { GetDocumentsInput } from './dto/getDocuments.input'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { MachineDto } from '@island.is/clients/work-machines'
import { GetMachineParentCategoryByTypeAndModelInput } from './dto/getMachineParentCategoryByTypeAndModel.input'
import { PaginatedCollectionResponse } from './models/workMachinePaginatedCollection.model'
import { WorkMachine } from './models/workMachine.model'
import {
  mapRelToAction,
  mapRelToCollectionLink,
  mapRelationToLink,
} from './mapper'
import { LinkCategory } from './workMachines.types'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class WorkMachinesService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly machineService: WorkMachinesClientService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
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
      data.machines
        ?.map((v) => ({
          id: v.id,
          registrationNumber: v.registrationNumber,
          typeBreakdown: v.type,
          status: v.status,
          category: v.category,
          subCategory: v.subCategory,
          dateLastInspection: v.dateLastInspection,
          licensePlateNumber: v.licensePlateNumber,
          paymentRequiredForOwnerChange: v.paymentRequiredForOwnerChange,
          owner: v.owner,
          supervisor: v.supervisor,
          labels: v.labels,
          //deprecation line
          type: v.type?.fullType,
          ownerNumber: v.owner?.number,
          ownerName: v.owner?.name,
          supervisorName: v.supervisor?.name,
        }))
        .filter(isDefined) ?? []

    const links = data.links?.length
      ? data.links.map((l) => {
          return {
            ...l,
            rel: mapRelToCollectionLink(l.rel ?? '') ?? undefined,
          }
        })
      : undefined

    const linkCollection = data.links?.length
      ? data.links
          .map((l) => {
            const rel = mapRelToAction(l.rel ?? '')
            const { type, category } = mapRelationToLink(l.rel) ?? {
              type: undefined,
              category: undefined,
            }

            const href =
              category === LinkCategory.DOWNLOAD
                ? `${this.downloadServiceConfig.baseUrl}/download/v1/workMachines/export/${type}`
                : l.href

            return {
              href,
              displayTitle: l.displayTitle,
              relation: type,
              relationCategory: category,
              rel: rel ?? undefined,
            }
          })
          .filter(isDefined)
      : undefined

    return {
      data: workMachines,
      linkCollection,
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
    const { id, registrationNumber, locale } = input

    let data: WorkMachinesCollectionItem | null
    if (registrationNumber) {
      data = await this.machineService.getWorkMachine(user, {
        regNumber: registrationNumber,
        locale,
      })
    } else if (id) {
      data = await this.machineService.getWorkMachine(user, { id, locale })
    } else {
      return null
    }

    if (!data || !data.id) {
      return null
    }

    if (!data.links || !data.labels) {
      this.logger.warn('No links or label in work machine response')
    }

    const links = data.links?.length
      ? data.links
          .map((l) => {
            const { href } = l
            const rel = mapRelToAction(l.rel ?? '')
            const { type, category } = mapRelationToLink(l.rel) ?? {
              type: undefined,
              category: undefined,
            }

            if (!rel || !href || !type) {
              return null
            }

            return {
              href: l.href,
              displayTitle: l.displayTitle,
              relation: type,
              relationCategory: category,
              rel: rel ?? undefined,
            }
          })
          .filter(isDefined)
      : undefined

    return {
      id: data.id,
      registrationNumber: data.registrationNumber,
      registrationDate: data.registrationDate,
      typeBreakdown: data.type,
      status: data.status,
      category: data.category,
      subCategory: data.subCategory,
      owner: data.owner,
      supervisor: data.supervisor,
      productionNumber: data.productionNumber,
      productionCountry: data.productionCountry,
      productionYear: data.productionYear,
      licensePlateNumber: data.licensePlateNumber,
      importer: data.importer,
      insurer: data.insurer,
      dateLastInspection: data.dateLastInspection,
      paymentRequiredForOwnerChange: data.paymentRequiredForOwnerChange,
      links,
      labels: data.labels,

      //deprecated line
      type: data.type?.fullType,
      ownerNumber: data.owner?.number,
      ownerName: data.owner?.name,
      ownerAddress: data.owner?.address,
      ownerNationalId: data.owner?.nationalId,
      ownerPostcode: data.owner?.postcode,
      supervisorName: data.supervisor?.name,
      supervisorAddress: data.supervisor?.address,
      supervisorNationalId: data.supervisor?.nationalId,
      supervisorPostcode: data.supervisor?.postcode,
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

  async getMachineModels(auth: User, type: string): Promise<Array<string>> {
    const models = await this.machineService.getMachineModels(auth, {
      tegund: type,
    })

    return models.map((m) => m.name).filter(isDefined)
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
